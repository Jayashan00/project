import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Blog from '../models/Blog.js';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middleware/auth.js'; // Corrected import

const router = express.Router();

// Get all blog posts
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('category').optional().isIn(['travel-tips', 'destinations', 'culture', 'food', 'adventure', 'photography', 'news']),
    query('status').optional().isIn(['published', 'draft', 'archived']),
    query('featured').optional().isBoolean()
], optionalAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        // Only show published posts to regular users
        if (!req.user || req.user.role !== 'admin') {
            filter.status = 'published';
            filter.publishDate = { $lte: new Date() };
        } else if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.category) filter.category = req.query.category;
        if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';
        if (req.query.search) filter.$text = { $search: req.query.search };

        const [posts, total] = await Promise.all([
            Blog.find(filter)
                .populate('author', 'firstName lastName')
                .select('-content -comments')
                .sort({ featured: -1, publishDate: -1 })
                .skip(skip)
                .limit(limit),
            Blog.countDocuments(filter)
        ]);

        res.json({
            data: posts,
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

// Get blog post by slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
    try {
        const filter = { slug: req.params.slug };
        if (!req.user || req.user.role !== 'admin') {
            filter.status = 'published';
        }
        const post = await Blog.findOne(filter)
            .populate('author', 'firstName lastName')
            .populate('comments.user', 'firstName lastName')
            .populate('comments.replies.user', 'firstName lastName')
            .populate('relatedPosts', 'title slug excerpt featuredImage');

        if (!post) return res.status(404).json({ error: 'Blog post not found' });

        // Increment view count
        post.views += 1;
        await post.save();

        res.json({ data: post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like/Unlike a blog post
router.post('/:id/like', authenticateToken, async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Blog post not found' });

        const userIdStr = req.user._id.toString();
        const likeIndex = post.likes.findIndex(like => like.user.toString() === userIdStr);

        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1); // Unlike
        } else {
            post.likes.push({ user: req.user._id }); // Like
        }
        await post.save();
        res.json({ likeCount: post.likes.length, liked: likeIndex === -1 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Add a comment to a blog post
router.post('/:id/comments', authenticateToken, [
    body('content').notEmpty().withMessage('Comment content cannot be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const post = await Blog.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Blog post not found' });

        const newComment = {
            user: req.user._id,
            content: req.body.content,
            approved: req.user.role === 'admin' // auto-approve for admins
        };

        post.comments.push(newComment);
        await post.save();

        await post.populate('comments.user', 'firstName lastName');

        res.status(201).json(post.comments[post.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
