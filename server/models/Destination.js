import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true,
    enum: ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Central', 'Uva', 'Sabaragamuwa']
  },
  category: {
    type: String,
    required: true,
    enum: ['Beach', 'Cultural', 'Adventure', 'Nature', 'Historical', 'Wildlife', 'Religious', 'Hill Country']
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  gallery: [String],
  amenities: [String],
  activities: [String],
  bestSeason: {
    type: String,
    enum: ['Year-round', 'December-April', 'May-September', 'October-January']
  },
  duration: {
    recommended: String,
    minimum: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Extreme']
  },
  budgetCategory: {
    type: String,
    enum: ['Budget', 'Moderate', 'Luxury'],
    default: 'Moderate'
  },
  entryFee: {
    local: Number,
    foreign: Number,
    currency: {
      type: String,
      default: 'LKR'
    }
  },
  openingHours: {
    open: String,
    close: String,
    isAlwaysOpen: {
      type: Boolean,
      default: false
    }
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: {
      type: String,
      required: true
    },
    images: [String],
    date: {
      type: Date,
      default: Date.now
    },
    helpful: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  facilities: [{
    name: String,
    available: Boolean,
    description: String
  }],
  transportation: {
    nearestAirport: String,
    airportDistance: Number,
    publicTransport: Boolean,
    parkingAvailable: Boolean,
    accessRoad: String
  },
  safety: {
    level: {
      type: String,
      enum: ['Very Safe', 'Safe', 'Moderate', 'Caution Required'],
      default: 'Safe'
    },
    tips: [String],
    emergencyContacts: [{
      service: String,
      number: String
    }]
  },
  weather: {
    averageTemp: {
      min: Number,
      max: Number
    },
    rainyMonths: [String],
    bestWeatherMonths: [String]
  },
  packages: [{
    name: String,
    description: String,
    duration: String,
    price: Number,
    includes: [String],
    excludes: [String]
  }],
  nearbyAttractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  visitCount: {
    type: Number,
    default: 0
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
destinationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
destinationSchema.index({ name: 'text', description: 'text', location: 'text' });
destinationSchema.index({ category: 1, region: 1, budgetCategory: 1 });
destinationSchema.index({ 'ratings.average': -1 });
destinationSchema.index({ featured: -1, createdAt: -1 });

// Virtual for primary image
destinationSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : this.images[0]?.url || '';
});

// Method to calculate average rating
destinationSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings = { average: 0, count: 0 };
    return;
  }
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.ratings = {
    average: Math.round((sum / this.reviews.length) * 10) / 10,
    count: this.reviews.length
  };
};

// Pre-save middleware to update ratings
destinationSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

// Ensure virtual fields are serialized
destinationSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Destination', destinationSchema);