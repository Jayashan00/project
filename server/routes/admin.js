import express from 'express';
import { adminAuth } from '../middleware/auth.js'; // Corrected import
import Analytics from '../models/Analytics.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// Admin dashboard overview
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        // Get real-time analytics
        const [
            userCount,
            totalBookings,
            totalRevenue,
            recentContacts,
            activeUsers,
            subscriptionStats,
            recentBookings
        ] = await Promise.all([
            User.countDocuments(),
            Booking.countDocuments(),
            Booking.aggregate([
                { $match: { status: 'confirmed' } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Contact.find({ status: 'new' }).sort({ createdAt: -1 }).limit(5),
            User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
            User.aggregate([
                { $group: { _id: "$subscription.plan", count: { $sum: 1 } } }
            ]),
            Booking.find()
                .populate('userId', 'firstName lastName email')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        const monthlyRevenue = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 }
        ]);

        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 }
        ]);

        res.json({
            overview: {
                totalUsers: userCount,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                activeUsers: activeUsers || 0
            },
            subscriptionStats,
            recentActivity: {
                contacts: recentContacts,
                bookings: recentBookings
            },
            analytics: {
                monthlyRevenue,
                userGrowth
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ error: 'Server error fetching dashboard data' });
    }
});

// User management
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching users' });
    }
});

// Booking management
router.get('/bookings', adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'firstName lastName email')
            .populate('destinationId', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching bookings' });
    }
});

// Contact management
router.get('/contacts', adminAuth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching contacts' });
    }
});

// Update contact status
router.patch('/contacts/:id', adminAuth, async (req, res) => {
    try {
        const { status, response } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                status,
                response: {
                    message: response,
                    date: new Date(),
                    by: req.user._id
                }
            },
            { new: true }
        );
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Server error updating contact' });
    }
});

export default router;
