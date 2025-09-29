import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Gallery from '../models/Gallery.js';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middleware/auth.js'; // Corrected import

const router = express.Router();

// Get all gallery collections
router.get('/', optionalAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const filter = {};

        if (!req.user || req.user.role !== 'admin') {
            filter.status = 'public';
        }
        if (req.query.category) filter.category = req.query.category;
        if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };


        const [galleries, total] = await Promise.all([
            Gallery.find(filter)
                .populate('createdBy', 'firstName lastName')
                .sort({ featured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Gallery.countDocuments(filter)
        ]);

        res.json({
            data: galleries,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single gallery by ID
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (!req.user || req.user.role !== 'admin') {
            filter.status = 'public';
        }

        const gallery = await Gallery.findOne(filter)
            .populate('destination', 'name location')
            .populate('createdBy', 'firstName lastName');

        if (!gallery) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        gallery.totalViews += 1;
        await gallery.save();

        res.json({ data: gallery });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
