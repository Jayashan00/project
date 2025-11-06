import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import bcrypt from 'bcryptjs';

// Import Models
import User from './models/User.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import destinationRoutes from './routes/destinations.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contact.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import hotelRoutes from './routes/hotels.js';
import blogRoutes from './routes/blog.js';
import galleryRoutes from './routes/gallery.js';
import healthRoutes from './routes/health.js';
import subscriptionRoutes from './routes/subscriptions.js';
import geocodeRoutes from './routes/geocode.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
};

const io = new Server(httpServer, { cors: corsOptions });

// --- THIS IS THE NEW FUNCTION TO CREATE THE ADMIN USER ---
const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (!existingAdmin) {
            console.log('Admin user not found. Creating default admin...');
            const adminUser = new User({
                username: "admin",
                email: "admin@gmail.com",
                password: "admin123", // The model's pre-save hook will hash this automatically
                firstName: "Admin",
                lastName: "User",
                role: "admin",
                verified: true,
            });
            await adminUser.save();
            console.log('Default admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
};

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        // --- CALL THE FUNCTION AFTER THE DATABASE CONNECTS ---
        createDefaultAdmin();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Security and middleware setup
app.use(helmet());
app.use(mongoSanitize());
app.use(cors(corsOptions));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.set('socketio', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/geocode', geocodeRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Static files for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;

