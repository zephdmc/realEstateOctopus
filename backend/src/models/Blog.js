import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  featuredImage: {
    url: String,
    alt: String,
    cloudinaryId: String
  },
  // Firebase author fields (replacing MongoDB ObjectId reference)
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true
  },
  authorAvatar: {
    type: String
  },
  categories: [{
    type: String,
    enum: [
      'market-news', 'home-improvement', 'investment', 'neighborhood',
      'design-tips', 'mortgage', 'legal', 'lifestyle'
    ]
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  readTime: {
    type: Number,
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  // Updated likes structure for Firebase
  likes: [{
    userId: {
      type: String,
      required: true
    },
    userName: String,
    userEmail: String,
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Updated comments structure for Firebase
  comments: [{
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: String,
    userAvatar: String,
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Keep track of when it was created/updated
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ 'seo.keywords': 1 });
blogSchema.index({ authorId: 1 }); // Index for Firebase UID
blogSchema.index({ 'likes.userId': 1 }); // Index for likes lookup
blogSchema.index({ 'comments.userId': 1 }); // Index for comments lookup

// Virtual for likes count
blogSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
blogSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Enhanced pre-save middleware to generate slug - FIXED VERSION
blogSchema.pre('save', function(next) {
  // Always generate slug if it doesn't exist, not just when title is modified
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
      .replace(/^-+/, '')          // Remove leading hyphens
      .replace(/-+$/, '');         // Remove trailing hyphens
  }
  
  // If slug is still empty (title was empty or invalid), generate a unique slug
  if (!this.slug) {
    this.slug = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Ensure slug is always unique by appending timestamp if needed
  // This will be handled by the unique index, but we can try to prevent conflicts
  const self = this;
  const Blog = mongoose.model('Blog');
  
  // Check if slug already exists (for new documents only)
  if (this.isNew) {
    Blog.findOne({ slug: this.slug })
      .then(existingPost => {
        if (existingPost) {
          // Append timestamp to make it unique
          self.slug = `${self.slug}-${Date.now()}`;
        }
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// Alternative: Pre-validate middleware to ensure slug exists before validation
blogSchema.pre('validate', function(next) {
  // This runs BEFORE validation, ensuring slug exists
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  
  // Fallback if no title or slug generation failed
  if (!this.slug) {
    this.slug = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

// Static method to get published posts
blogSchema.statics.getPublished = function() {
  return this.find({ status: 'published' }).sort({ createdAt: -1 });
};

// Static method to get posts by author (Firebase UID)
blogSchema.statics.getByAuthor = function(authorId) {
  return this.find({ authorId }).sort({ createdAt: -1 });
};

// Static method to get featured posts
blogSchema.statics.getFeatured = function() {
  return this.find({ 
    status: 'published',
    featured: true 
  }).limit(6).sort({ createdAt: -1 });
};

// Instance method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to check if user liked the post
blogSchema.methods.hasLiked = function(userId) {
  return this.likes.some(like => like.userId === userId);
};

// Instance method to add like
blogSchema.methods.addLike = function(userId, userName = 'User', userEmail = '') {
  if (!this.hasLiked(userId)) {
    this.likes.push({
      userId,
      userName,
      userEmail,
      likedAt: new Date()
    });
  }
  return this.save();
};

// Instance method to remove like
blogSchema.methods.removeLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => like.userId === userId);
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  }
  return this.save();
};

// Instance method to toggle like
blogSchema.methods.toggleLike = function(userId, userName = 'User', userEmail = '') {
  if (this.hasLiked(userId)) {
    return this.removeLike(userId);
  } else {
    return this.addLike(userId, userName, userEmail);
  }
};

// Instance method to add comment
blogSchema.methods.addComment = function(userId, userName, content, userEmail = '', userAvatar = '') {
  this.comments.push({
    userId,
    userName,
    userEmail,
    userAvatar,
    content,
    createdAt: new Date()
  });
  return this.save();
};

export default mongoose.model('Blog', blogSchema);