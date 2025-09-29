import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'business'],
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
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
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
  }],
  features: {
    bookingsPerMonth: Number,
    customSupport: Boolean,
    priorityAccess: Boolean,
    analyticsAccess: Boolean
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Pre-save middleware to update user subscription status
subscriptionSchema.pre('save', async function(next) {
  if (this.isModified('status') || this.isModified('endDate')) {
    try {
      await mongoose.model('User').findByIdAndUpdate(this.userId, {
        'subscription.plan': this.plan,
        'subscription.status': this.status,
        'subscription.endDate': this.endDate
      });
    } catch (error) {
      console.error('Error updating user subscription:', error);
    }
  }
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
