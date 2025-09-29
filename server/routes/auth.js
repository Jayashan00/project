import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// --- Helper to generate tokens ---
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// --- Registration Route ---
router.post(
    '/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        try {
            const { username, email, password, firstName, lastName } = req.body;

            const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
            if (existingUser) {
                const message = existingUser.email === email.toLowerCase() ? 'Email is already registered' : 'Username is already taken';
                return res.status(400).json({ error: message });
            }

            const user = new User({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
                firstName,
                lastName,
            });

            await user.save();

            await Analytics.create({
                userId: user._id,
                type: 'auth',
                action: 'register',
                metadata: { timestamp: new Date() }
            });

            // *** FIX IMPLEMENTED ***
            // Automatically log the user in after successful registration.
            const { accessToken, refreshToken } = generateTokens(user);

            user.refreshToken = refreshToken;
            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;
            delete userResponse.refreshToken;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                message: 'Registration successful!',
                token: accessToken,
                user: userResponse
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed. Please try again.' });
        }
    }
);

// --- Login Route ---
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
            }

            if (user.disabled) {
                return res.status(403).json({ error: 'Your account has been disabled.' });
            }

            const { accessToken, refreshToken } = generateTokens(user);

            user.refreshToken = refreshToken;
            user.lastActive = new Date();
            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;
            delete userResponse.refreshToken;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            
            await Analytics.findOneAndUpdate(
                { userId: user._id },
                { $set: { 'sessionData.lastLogin': new Date() }, $inc: { 'sessionData.loginCount': 1 } },
                { upsert: true }
            );

            res.json({ token: accessToken, user: userResponse });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'An internal server error occurred.' });
        }
    }
);


// --- Get Current User (/me) Route ---
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// --- Logout Route ---
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

