import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['travel-tips', 'destinations', 'culture', 'food', 'adventure', 'photography', 'news']
  },
  tags: [String],
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  gallery: [{
    url: String,
    alt: String,
    caption: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
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
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    approved: {
      type: Boolean,
      default: false
    }
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  readingTime: Number, // in minutes
  social: {
    shares: {
      facebook: {
        type: Number,
        default: 0
      },
      twitter: {
        type: Number,
        default: 0
      },
      instagram: {
        type: Number,
        default: 0
      },
      linkedin: {
        type: Number,
        default: 0
      }
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to update lastModified
blogSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  
  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(' ').length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Index for efficient queries
blogSchema.index({ status: 1, publishDate: -1 });
blogSchema.index({ category: 1, publishDate: -1 });
blogSchema.index({ featured: -1, publishDate: -1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => comment.approved).length;
});

// Ensure virtual fields are serialized
blogSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Blog', blogSchema);