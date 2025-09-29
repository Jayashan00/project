import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Destination from '../models/Destination.js';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middleware/auth.js';
import Analytics from '../models/Analytics.js';
import User from '../models/User.js';

const router = express.Router();

// Get all destinations with filtering and pagination
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isIn(['Beach', 'Cultural', 'Adventure', 'Nature', 'Historical', 'Wildlife', 'Religious', 'Hill Country']),
    query('region').optional().isIn(['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Central', 'Uva', 'Sabaragamuwa']),
    query('budget').optional().isIn(['Budget', 'Moderate', 'Luxury']),
    query('minRating').optional().isFloat({ min: 0, max: 5 }),
    query('sortBy').optional().isIn(['name', 'ratings.average', 'createdAt', 'visitCount']),
    query('order').optional().isIn(['asc', 'desc'])
], optionalAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter query
        let filter = { status: 'active' };

        if (req.query.category) filter.category = req.query.category;
        if (req.query.region) filter.region = req.query.region;
        if (req.query.budget) filter.budgetCategory = req.query.budget;
        if (req.query.minRating) filter['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
        if (req.query.search) filter.$text = { $search: req.query.search };
        if (req.query.featured === 'true') filter.featured = true;

        // Build sort query
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        const sort = { [sortBy]: order };

        const [destinations, total] = await Promise.all([
            Destination.find(filter)
                .select('-reviews -createdBy') // Exclude heavy fields for list view
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Destination.countDocuments(filter)
        ]);

        res.json({
            data: destinations,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch destinations', details: error.message });
    }
});


// Get featured destinations
router.get('/featured', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const destinations = await Destination.find({ featured: true, status: 'active' })
            .select('-reviews')
            .sort({ 'ratings.average': -1, visitCount: -1 })
            .limit(limit)
            .lean();
        res.json({ data: destinations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get destination by ID
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id)
            .populate('reviews.user', 'firstName lastName')
            .populate('nearbyAttractions', 'name location category')
            .populate('createdBy', 'firstName lastName');

        if (!destination || destination.status !== 'active') {
            return res.status(404).json({ error: 'Destination not found' });
        }

        // Increment visit count without waiting for it to finish
        Destination.findByIdAndUpdate(req.params.id, { $inc: { visitCount: 1 } }).exec();

        res.json({ data: destination });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new destination (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), [
    body('name').notEmpty().trim(),
    body('description').notEmpty().isLength({ min: 20 }),
    body('location').notEmpty(),
    body('region').isIn(['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Central', 'Uva', 'Sabaragamuwa']),
    body('category').isIn(['Beach', 'Cultural', 'Adventure', 'Nature', 'Historical', 'Wildlife', 'Religious', 'Hill Country']),
    body('coordinates.latitude').isFloat({ min: -90, max: 90 }),
    body('coordinates.longitude').isFloat({ min: -180, max: 180 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const destination = new Destination({
            ...req.body,
            createdBy: req.user._id
        });

        await destination.save();
        res.status(201).json({ message: 'Destination created successfully', data: destination });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create destination', details: error.message });
    }
});

// Update destination (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        res.json({ message: 'Destination updated successfully', data: destination });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update destination', details: error.message });
    }
});

// Delete destination (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.json({ message: 'Destination deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete destination', details: error.message });
    }
});

// Add review to destination
router.post('/:id/reviews', authenticateToken, [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').notEmpty().isLength({ min: 10, max: 1000 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rating, comment, title, images } = req.body;
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        const existingReview = destination.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this destination' });
        }

        destination.reviews.push({
            user: req.user._id,
            rating,
            title,
            comment,
            images: images || []
        });

        await destination.save(); // pre-save hook will recalculate average rating
        await destination.populate('reviews.user', 'firstName lastName');

        res.status(201).json({
            message: 'Review added successfully',
            data: destination.reviews[destination.reviews.length - 1]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add review', details: error.message });
    }
});

// Get real-time weather for a destination
router.get('/:id/weather', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id).select('coordinates');
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        const { latitude, longitude } = destination.coordinates;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Weather service is not configured.' });
        }
        
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        
        const response = await fetch(weatherUrl);
        if(!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();

        res.json(weatherData);

    } catch (error) {
        console.error("Weather fetch error:", error);
        res.status(500).json({ error: 'Could not retrieve weather information.' });
    }
});


export default router;

