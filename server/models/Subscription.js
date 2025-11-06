import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['island wanderer', 'cultural explorer', 'premium adventurer', 'free', 'basic', 'premium', 'business'],
    required: true
  },
  price: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    // *** FIX: Added 'pending' to the list of allowed statuses ***
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    transactionId: String,
    status: {
      type: String,
      enum: ['success', 'failed', 'refunded']
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
