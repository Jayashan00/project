import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pageViews: [{
    page: String,
    timestamp: Date,
    duration: Number
  }],
  searchQueries: [{
    query: String,
    timestamp: Date,
    results: Number
  }],
  bookings: [{
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    amount: Number,
    destination: String,
    timestamp: Date
  }],
  interactions: [{
    type: {
      type: String,
      enum: ['click', 'hover', 'scroll', 'submit']
    },
    element: String,
    page: String,
    timestamp: Date
  }],
  userMetrics: {
    totalSpent: {
      type: Number,
      default: 0
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    avgBookingValue: {
      type: Number,
      default: 0
    },
    mostViewedDestinations: [{
      destination: String,
      views: Number
    }],
    preferredActivities: [{
      activity: String,
      count: Number
    }]
  },
  sessionData: {
    lastLogin: Date,
    loginCount: Number,
    averageSessionDuration: Number,
    deviceInfo: {
      browser: String,
      os: String,
      device: String
    }
  },
  marketingMetrics: {
    source: String,
    campaign: String,
    conversionPath: [{
      touchpoint: String,
      timestamp: Date
    }]
  }
}, {
  timestamps: true
});

// Index for efficient queries
analyticsSchema.index({ userId: 1, 'pageViews.timestamp': -1 });
analyticsSchema.index({ 'bookings.timestamp': -1 });

// Method to add page view
analyticsSchema.methods.addPageView = function(page, duration) {
  this.pageViews.push({
    page,
    timestamp: new Date(),
    duration
  });
  return this.save();
};

// Method to add booking analytics
analyticsSchema.methods.addBooking = function(bookingId, amount, destination) {
  this.bookings.push({
    bookingId,
    amount,
    destination,
    timestamp: new Date()
  });

  // Update user metrics
  this.userMetrics.totalSpent += amount;
  this.userMetrics.totalBookings += 1;
  this.userMetrics.avgBookingValue = this.userMetrics.totalSpent / this.userMetrics.totalBookings;

  return this.save();
};

// Method to update session data
analyticsSchema.methods.updateSession = function(deviceInfo) {
  this.sessionData.lastLogin = new Date();
  this.sessionData.loginCount = (this.sessionData.loginCount || 0) + 1;
  if (deviceInfo) {
    this.sessionData.deviceInfo = deviceInfo;
  }
  return this.save();
};

// Static method to get popular destinations
analyticsSchema.statics.getPopularDestinations = async function(limit = 5) {
  return this.aggregate([
    { $unwind: '$userMetrics.mostViewedDestinations' },
    { $group: {
      _id: '$userMetrics.mostViewedDestinations.destination',
      totalViews: { $sum: '$userMetrics.mostViewedDestinations.views' }
    }},
    { $sort: { totalViews: -1 } },
    { $limit: limit }
  ]);
};

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
