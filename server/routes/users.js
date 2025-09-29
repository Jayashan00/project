import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Analytics from '../models/Analytics.js';
import { authenticateToken } from '../middleware/auth.js'; // Corrected import

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
        ).select('-password');

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [totalBookings, totalSpent, recentBookings] = await Promise.all([
            Booking.countDocuments({ userId }),
            Booking.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Booking.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('destinationId', 'name images')
        ]);

        res.json({
            overview: {
                totalBookings,
                totalSpent: totalSpent[0]?.total || 0,
            },
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
