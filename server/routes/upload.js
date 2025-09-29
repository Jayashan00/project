import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js'; // Corrected import
import fs from 'fs/promises';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'), false);
        }
    }
});

// Single image upload
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // In a real app, you would process the image (e.g., resize with sharp)
        // and return the URL.
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Avatar upload
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { filename, path: filePath } = req.file;
        const processedPath = path.join(__dirname, '../uploads', `avatar-${filename}`);

        await sharp(filePath)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toFile(processedPath);

        await fs.unlink(filePath); // remove original

        const avatarUrl = `/uploads/avatar-${filename}`;
        await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl });

        res.json({ url: avatarUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
