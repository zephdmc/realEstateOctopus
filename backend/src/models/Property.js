// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  createdBy: { type: String, required: true }, // Firebase UID
  agentId: { type: String, required: true },   // Firebase UID
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NAN']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['house', 'apartment', 'condo', 'villa', 'townhouse', 'land', 'commercial']
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent', 'sold', 'rented'],
    default: 'for-sale'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      default: 'United States'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specifications: {
    bedrooms: {
      type: Number,
      min: 0,
      required: true
    },
    bathrooms: {
      type: Number,
      min: 0,
      required: true
    },
    area: {
      type: Number,
      required: true,
      min: 0
    },
    areaUnit: {
      type: String,
      default: 'sqft',
      enum: ['sqft', 'sqm']
    },
    yearBuilt: Number,
    floors: {
      type: Number,
      min: 1,
      default: 1
    },
    parking: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  amenities: [{
    type: String,
    enum: [
      'swimming-pool', 'garden', 'garage', 'balcony', 'fireplace',
      'air-conditioning', 'heating', 'security-system', 'elevator',
      'gym', 'parking', 'furnished', 'pet-friendly'
    ]
  }],
  
  // UPDATED IMAGE FIELDS - Use references to Upload model
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload'
  }],
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload'
  },
  
  // Keep your existing featured field for general featuring
  featured: {
    type: Boolean,
    default: false
  },
  
  // Remove duplicate agentId field (you have it at the top)
  // agentId: { type: String, ref: 'User', required: true }, // REMOVE THIS DUPLICATE
  
  virtualTour: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Virtual tour must be a valid URL'
    }
  },
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Add agent info fields for better data consistency
  agentName: String,
  agentEmail: String,
  agentInfo: {
    name: String,
    email: String,
    photoURL: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
propertySchema.index({ price: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ featured: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ images: 1 }); // Add index for images

// Virtual for formatted address
propertySchema.virtual('formattedAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Virtual for getting the primary image URL (first image or featured image)
propertySchema.virtual('primaryImage').get(function() {
  if (this.featuredImage && this.featuredImage.url) {
    return this.featuredImage.url;
  }
  if (this.images && this.images.length > 0 && this.images[0].url) {
    return this.images[0].url;
  }
  return '/placeholder-property.jpg';
});

// Static method to get featured properties
propertySchema.statics.getFeatured = function() {
  return this.find({ featured: true, status: { $in: ['for-sale', 'for-rent'] } })
    .populate('images')
    .populate('featuredImage')
    .limit(6)
    .sort({ createdAt: -1 });
};

// Static method to get properties with images populated
propertySchema.statics.getPropertiesWithImages = function(filter = {}) {
  return this.find(filter)
    .populate('images')
    .populate('featuredImage')
    .sort({ createdAt: -1 });
};

// Instance method to mark as sold/rented
propertySchema.methods.markAsSold = function() {
  this.status = this.status === 'for-sale' ? 'sold' : 'rented';
  return this.save();
};

// Instance method to add image to property
propertySchema.methods.addImage = function(imageId) {
  if (!this.images.includes(imageId)) {
    this.images.push(imageId);
  }
  // If no featured image is set, set this as featured
  if (!this.featuredImage) {
    this.featuredImage = imageId;
  }
  return this.save();
};

// Instance method to set featured image
propertySchema.methods.setFeaturedImage = function(imageId) {
  // Check if the image exists in the property's images
  if (this.images.includes(imageId)) {
    this.featuredImage = imageId;
    return this.save();
  }
  throw new Error('Image not found in property images');
};

export default mongoose.model('Property', propertySchema);