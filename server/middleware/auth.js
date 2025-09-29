import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to authenticate a user with a JWT.
 * Verifies the token and attaches the user object to the request.
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        const user = await User.findById(decoded.id);
        if (!user || user.disabled) {
            return res.status(401).json({ error: 'User not found or account disabled' });
        }

        req.user = user; // Attach the full user object to the request
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Middleware for routes that can be accessed by both guests and logged-in users.
 * If a valid token is present, it attaches the user object to the request.
 */
export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(); // No token, proceed without a user object
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id);
        if (user && !user.disabled) {
            req.user = user;
        }
    } catch (error) {
        // If token is invalid, just proceed without a user
    }
    next();
};

/**
 * Middleware factory to authorize specific user roles.
 * @param {...string} roles - The roles that are allowed to access the route.
 */
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. You do not have the required permissions.' });
        }
        next();
    };
};

/**
 * Middleware to specifically protect routes that require admin privileges.
 * This is a combination of authenticating the token and authorizing the 'admin' role.
 */
export const adminAuth = [authenticateToken, authorizeRoles('admin')];

