// models/Upload.js
import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: false // ← CHANGED TO FALSE (optional for Cloudinary)
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true // ← ADD THIS since you're using Cloudinary
  },
  uploadedBy: {
    type: mongoose.Schema.Types.Mixed, // ← CHANGE TO Mixed type
    ref: 'User',
    required: false // ← Change to false
  },
  category: {
    type: String,
    enum: ['property', 'blog', 'profile', 'document', 'other'],
    default: 'other'
  },
  description: String,
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes (keep the same)
uploadSchema.index({ uploadedBy: 1 });
uploadSchema.index({ category: 1 });
uploadSchema.index({ createdAt: -1 });
uploadSchema.index({ tags: 1 });

export default mongoose.model('Upload', uploadSchema);