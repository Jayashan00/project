import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 }
  },
  roomType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAt: Date
  },
  specialRequests: String,
  cancellation: {
    date: Date,
    reason: String,
    refundAmount: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ destinationId: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });

// Calculate duration of stay
bookingSchema.virtual('duration').get(function() {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update analytics
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Analytics = mongoose.model('Analytics');
      await Analytics.findOneAndUpdate(
        { userId: this.userId },
        {
          $push: {
            bookings: {
              bookingId: this._id,
              amount: this.amount,
              destination: this.destinationId,
              timestamp: new Date()
            }
          },
          $inc: {
            'userMetrics.totalSpent': this.amount,
            'userMetrics.totalBookings': 1
          }
        },
        { upsert: true }
      );

      // Update user's total spent
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(this.userId, {
        $inc: {
          'analytics.totalSpent': this.amount
        }
      });
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
