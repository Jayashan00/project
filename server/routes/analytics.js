import express from 'express';
import Analytics from '../models/Analytics.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Helper function to get most viewed pages from analytics data
function getMostViewedPages(pageViews) {
    if (!pageViews || pageViews.length === 0) {
        return [];
    }
    const pageCount = pageViews.reduce((acc, view) => {
        acc[view.page] = (acc[view.page] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(pageCount)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

// Track a page view
router.post('/pageview', optionalAuth, async (req, res) => {
    try {
        if (req.user) {
            const { page, duration } = req.body;
            await Analytics.findOneAndUpdate(
                { userId: req.user._id },
                { $push: { pageViews: { page, duration, timestamp: new Date() } } },
                { upsert: true, new: true }
            );
        }
        res.status(200).json({ message: 'Page view tracked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track page view' });
    }
});

// Track a user interaction
router.post('/interaction', optionalAuth, async (req, res) => {
    try {
        if (req.user) {
            const { type, element, page } = req.body;
            await Analytics.findOneAndUpdate(
                { userId: req.user._id },
                { $push: { interactions: { type, element, page, timestamp: new Date() } } },
                { upsert: true, new: true }
            );
        }
        res.status(200).json({ message: 'Interaction tracked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track interaction' });
    }
});


// Get analytics for the logged-in user's dashboard
router.get('/user-dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [userData, bookings, analytics] = await Promise.all([
            User.findById(userId).select('subscription').lean(),
            Booking.find({ userId }).populate('destinationId', 'name').lean(),
            Analytics.findOne({ userId }).lean()
        ]);

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const totalSpent = bookings.reduce((sum, booking) => sum + booking.amount, 0);
        const avgBookingValue = bookings.length > 0 ? totalSpent / bookings.length : 0;

        const response = {
            overview: {
                totalBookings: bookings.length,
                totalSpent,
                avgBookingValue,
                subscriptionStatus: userData.subscription.status,
                subscriptionPlan: userData.subscription.plan
            },
            bookingHistory: bookings,
            activityMetrics: analytics ? {
                pageViews: analytics.pageViews?.length || 0,
                lastActive: analytics.sessionData?.lastLogin,
                mostViewedPages: getMostViewedPages(analytics.pageViews)
            } : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user analytics', details: error.message });
    }
});

// Get site-wide conversion funnel analytics (Admin only)
router.get('/site-funnel', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const period = req.query.period || '30d';
        let dateFilter = {};
        if (period === '7d') {
            dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        } else {
            dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        }

        const [
            totalVisitors,
            destinationViewers,
            bookingInitiators,
            completedBookings
        ] = await Promise.all([
            Analytics.distinct('userId', { 'pageViews.timestamp': dateFilter }).then(users => users.length),
            Analytics.distinct('userId', { 'interactions.element': 'destination_view', 'interactions.timestamp': dateFilter }).then(users => users.length),
            Analytics.distinct('userId', { 'interactions.element': 'booking_start', 'interactions.timestamp': dateFilter }).then(users => users.length),
            Booking.distinct('userId', { createdAt: dateFilter, status: { $in: ['confirmed', 'completed'] } }).then(users => users.length)
        ]);
        
        const funnel = [
            { stage: 'Visitors', count: totalVisitors, percentage: 100 },
            { stage: 'Viewed Destination', count: destinationViewers, percentage: totalVisitors > 0 ? ((destinationViewers / totalVisitors) * 100).toFixed(1) : 0 },
            { stage: 'Started Booking', count: bookingInitiators, percentage: totalVisitors > 0 ? ((bookingInitiators / totalVisitors) * 100).toFixed(1) : 0 },
            { stage: 'Completed Booking', count: completedBookings, percentage: totalVisitors > 0 ? ((completedBookings / totalVisitors) * 100).toFixed(1) : 0 }
        ];

        res.json({ data: funnel });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch site funnel', details: error.message });
    }
});


export default router;

