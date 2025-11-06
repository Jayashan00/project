import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import mongoose from 'mongoose';

// Store plan details on the backend for security and validation.
const plans = {
    "island wanderer": { price: 12.99, duration: "monthly" },
    "cultural explorer": { price: 34.99, duration: "quarterly" },
    "premium adventurer": { price: 119.99, duration: "yearly" }
};

const router = express.Router();

/**
 * @route   POST /api/subscriptions/create
 * @desc    Creates a new subscription or updates an existing one when a user selects a plan.
 * @access  Private
 */
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { plan: planName } = req.body;
        const userId = req.user.id;
        const planKey = planName.toLowerCase();
        
        const planDetails = plans[planKey];
        if (!planDetails) {
            return res.status(400).json({ error: 'Invalid plan selected.' });
        }

        const isPaidPlan = planDetails.price > 0;

        // Create or update the subscription. If it's a paid plan, its status is 'pending' until payment is confirmed.
        const newOrUpdatedSubscription = await Subscription.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) },
            {
                plan: planKey,
                status: isPaidPlan ? 'pending' : 'active',
                price: { amount: planDetails.price, currency: 'USD' },
                startDate: new Date(),
                // Simplified end date for now (e.g., one year from now)
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
            { upsert: true, new: true, runValidators: true }
        );

        if (isPaidPlan) {
            // This tells the frontend to proceed to the payment page.
            res.status(200).json({ 
                message: 'Subscription pending payment.',
                subscriptionId: newOrUpdatedSubscription._id,
                amount: planDetails.price,
                paymentRequired: true 
            });
        } else {
            // This handles free plans, activating them immediately.
            await User.findByIdAndUpdate(userId, {
                'subscription.plan': newOrUpdatedSubscription.plan,
                'subscription.status': 'active',
                'subscription.endDate': newOrUpdatedSubscription.endDate,
            });
            res.status(200).json({ 
                message: 'Free subscription activated!',
                subscription: newOrUpdatedSubscription,
                paymentRequired: false
            });
        }

    } catch (error) {
        console.error('Subscription creation error:', error);
        res.status(500).json({ error: 'Failed to create subscription.' });
    }
});

/**
 * @route   POST /api/subscriptions/confirm-payment
 * @desc    Confirms a payment and activates the user's subscription.
 * @access  Private
 */
router.post('/confirm-payment', authenticateToken, async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const userId = req.user.id;

        if (!subscriptionId) {
            return res.status(400).json({ error: "Subscription ID is required." });
        }

        const subscription = await Subscription.findOne({ _id: subscriptionId, userId });

        if (!subscription) {
            return res.status(404).json({ error: "Subscription not found or does not belong to user." });
        }

        // Update subscription status to 'active'
        subscription.status = 'active';
        subscription.startDate = new Date(); // Reset start date upon payment confirmation
        await subscription.save();
        
        // Also update the user's main subscription status in the User model for quick access
        await User.findByIdAndUpdate(userId, {
            'subscription.plan': subscription.plan,
            'subscription.status': 'active',
            'subscription.endDate': subscription.endDate,
        });

        res.status(200).json({ message: "Payment confirmed and subscription is now active!" });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ error: "Failed to confirm payment." });
    }
});

export default router;

