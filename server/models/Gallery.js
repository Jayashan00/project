import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  images: [{
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    alt: String,
    caption: String,
    tags: [String],
    location: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    photographer: {
      name: String,
      credit: String
    },
    camera: {
      make: String,
      model: String,
      settings: {
        iso: String,
        aperture: String,
        shutterSpeed: String,
        focalLength: String
      }
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    downloads: {
      type: Number,
      default: 0
    }
  }],
  category: {
    type: String,
    required: true,
    enum: ['landscapes', 'culture', 'wildlife', 'beaches', 'temples', 'food', 'people', 'architecture', 'festivals', 'nature']
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['public', 'private', 'archived'],
    default: 'public'
  },
  tags: [String],
  season: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'all']
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalDownloads: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
gallerySchema.index({ category: 1, createdAt: -1 });
gallerySchema.index({ destination: 1, createdAt: -1 });
gallerySchema.index({ featured: -1, createdAt: -1 });
gallerySchema.index({ createdBy: 1, createdAt: -1 });
gallerySchema.index({ tags: 1 });

// Pre-save middleware to update totals
gallerySchema.pre('save', function(next) {
  this.totalViews = this.images.reduce((sum, img) => sum + img.views, 0);
  this.totalLikes = this.images.reduce((sum, img) => sum + img.likes.length, 0);
  this.totalDownloads = this.images.reduce((sum, img) => sum + img.downloads, 0);
  next();
});

export default mongoose.model('Gallery', gallerySchema);