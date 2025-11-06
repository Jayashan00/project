import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';
import Subscription from '../models/Subscription.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/profile', authenticateToken, [
    body('firstName').optional().notEmpty().trim(),
    body('lastName').optional().notEmpty().trim(),
    body('country').optional().trim(),
    body('phone').optional().trim(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { firstName, lastName, phone, country } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, phone, country },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});


// --- NEW & IMPROVED DASHBOARD ROUTE ---
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

        const [
            userProfile,
            userSubscription,
            bookingStats,
            recentBookings,
            recentContacts
        ] = await Promise.all([
            User.findById(userIdAsObjectId).select('firstName lastName email username country phone subscription').lean(),
            Subscription.findOne({ userId: userIdAsObjectId }).lean(),
            Booking.aggregate([
                { $match: { userId: userIdAsObjectId } },
                {
                    $group: {
                        _id: null,
                        totalBookings: { $sum: 1 },
                        totalSpent: { $sum: '$amount' },
                        activeBookings: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0]
                            }
                        }
                    }
                }
            ]),
            Booking.find({ userId: userIdAsObjectId })
                .sort({ createdAt: -1 })
                .limit(3)
                .populate('destinationId', 'name images')
                .lean(),
            Contact.find({ email: userEmail })
                .sort({ createdAt: -1 })
                .limit(3)
                .lean()
        ]);

        const overview = {
            totalBookings: bookingStats[0]?.totalBookings || 0,
            totalSpent: bookingStats[0]?.totalSpent || 0,
            activeBookings: bookingStats[0]?.activeBookings || 0,
        };

        res.json({
            data: {
                profile: userProfile,
                subscription: userSubscription,
                overview,
                recentBookings,
                recentContacts,
            }
        });

    } catch (error) {
        console.error("Dashboard data fetch error:", error);
        res.status(500).json({ error: 'An internal server error occurred while fetching dashboard data.' });
    }
});

export default router;

