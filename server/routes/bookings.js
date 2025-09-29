import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'; // Corrected import
import Analytics from '../models/Analytics.js';

const router = express.Router();

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('destinationId', 'name location images')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings (Admin only)
router.get('/admin', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'firstName lastName email')
            .populate('destinationId', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new booking
router.post('/', authenticateToken, [
    body('destinationId').isMongoId(),
    body('checkIn').isISO8601(),
    body('checkOut').isISO8601(),
    body('guests.adults').isInt({ min: 1 }),
    body('amount').isFloat({ min: 0 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { destinationId, checkIn, checkOut } = req.body;
        
        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            return res.status(400).json({ error: 'Check-out date must be after check-in date' });
        }

        const booking = new Booking({
            ...req.body,
            userId: req.user.id
        });

        await booking.save();

        // Analytics are handled in the booking model pre-save hook

        await booking.populate('destinationId', 'name location images');
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
