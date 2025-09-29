import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { optionalAuth, adminAuth } from '../middleware/auth.js';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// POST a new contact message
router.post('/', optionalAuth, [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('message').notEmpty().withMessage('Message is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, tourType, travelers, duration, budget, preferredDate, message } = req.body;
        
        const newContact = new Contact({
            name,
            email,
            tourType,
            travelers,
            duration,
            budget,
            preferredDate,
            message,
            metadata: {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            }
        });

        await newContact.save();

        // Track analytics if user is logged in
        if (req.user && req.user.id) {
            await Analytics.findOneAndUpdate(
                { userId: req.user.id },
                {
                    $push: {
                        interactions: {
                            type: 'submit',
                            element: 'contact_form',
                            page: '/contact',
                            timestamp: new Date()
                        }
                    }
                },
                { upsert: true, new: true }
            );
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!'
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            error: 'Failed to send message',
            details: error.message
        });
    }
});

// GET contact statistics (Admin only)
router.get('/admin/statistics', adminAuth, async (req, res) => {
    try {
        const [
            totalMessages,
            newMessages,
            inProgressMessages,
            respondedMessages,
            closedMessages,
            tourTypeStats,
            monthlyStats
        ] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'new' }),
            Contact.countDocuments({ status: 'in-progress' }),
            Contact.countDocuments({ status: 'responded' }),
            Contact.countDocuments({ status: 'closed' }),
            Contact.aggregate([
                { $group: { _id: '$tourType', count: { $sum: 1 } } }
            ]),
            Contact.aggregate([
                {
                    $match: {
                        createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);

        const stats = {
            overview: {
                total: totalMessages,
                new: newMessages,
                inProgress: inProgressMessages,
                responded: respondedMessages,
                closed: closedMessages
            },
            byTourType: tourTypeStats,
            monthly: monthlyStats
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
