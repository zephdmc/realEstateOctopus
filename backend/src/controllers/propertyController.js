// import Property from '../models/Property.js';
// import asyncHandler from '../utils/asyncHandler.js';
// import ErrorResponse from '../utils/ErrorResponse.js';

// // @desc    Get all properties
// // @route   GET /api/properties
// // @access  Public
// export const getProperties = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 12,
//     type,
//     status,
//     minPrice,
//     maxPrice,
//     bedrooms,
//     bathrooms,
//     city,
//     featured,
//     search
//   } = req.query;

//   // Build filter object
//   const filter = { isActive: true }; // Add active filter

//   if (type) filter.type = type;
//   if (status) filter.status = status;
//   if (featured) filter.featured = featured === 'true';
  
//   if (minPrice || maxPrice) {
//     filter.price = {};
//     if (minPrice) filter.price.$gte = parseInt(minPrice);
//     if (maxPrice) filter.price.$lte = parseInt(maxPrice);
//   }
  
//   if (bedrooms) filter['specifications.bedrooms'] = { $gte: parseInt(bedrooms) };
//   if (bathrooms) filter['specifications.bathrooms'] = { $gte: parseInt(bathrooms) };
//   if (city) filter['location.city'] = new RegExp(city, 'i');
  
//   if (search) {
//     filter.$or = [
//       { title: new RegExp(search, 'i') },
//       { description: new RegExp(search, 'i') },
//       { 'location.address': new RegExp(search, 'i') },
//       { 'location.city': new RegExp(search, 'i') }
//     ];
//   }

//   // Execute query with pagination
//   const properties = await Property.find(filter)
//     .limit(limit * 1)
//     .skip((page - 1) * limit)
//     .sort({ createdAt: -1 });

//   // Get total count for pagination
//   const total = await Property.countDocuments(filter);

//   res.status(200).json({
//     success: true,
//     count: properties.length,
//     total,
//     pagination: {
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       limit: parseInt(limit)
//     },
//     data: properties
//   });
// });

// // @desc    Get single property
// // @route   GET /api/properties/:id
// // @access  Public
// export const getProperty = asyncHandler(async (req, res) => {
//   const property = await Property.findById(req.params.id);

//   if (!property) {
//     throw new ErrorResponse('Property not found', 404);
//   }

//   res.status(200).json({
//     success: true,
//     data: property
//   });
// });

// // @desc    Create new property
// // @route   POST /api/properties
// // @access  Private/Admin
// export const createProperty = asyncHandler(async (req, res) => {
//   // Add Firebase user info as agent/creator
//   const propertyData = {
//     ...req.body,
//     createdBy: req.user.uid, // Firebase UID
//     agentId: req.user.uid,   // Firebase UID
//     agentName: req.user.displayName || 'Admin',
//     agentEmail: req.user.email,
//     // Include any other agent info you want to store
//     agentInfo: {
//       name: req.user.displayName,
//       email: req.user.email,
//       photoURL: req.user.photoURL
//     }
//   };

//   const property = await Property.create(propertyData);

//   res.status(201).json({
//     success: true,
//     data: property,
//     message: 'Property created successfully'
//   });
// });

// // @desc    Update property
// // @route   PUT /api/properties/:id
// // @access  Private/Admin
// export const updateProperty = asyncHandler(async (req, res) => {
//   let property = await Property.findById(req.params.id);

//   if (!property) {
//     throw new ErrorResponse('Property not found', 404);
//   }

//   // Since we're using requireAdmin middleware, no need to check ownership
//   // Only admins can reach this point
//   property = await Property.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true
//     }
//   );

//   res.status(200).json({
//     success: true,
//     data: property,
//     message: 'Property updated successfully'
//   });
// });

// // @desc    Delete property
// // @route   DELETE /api/properties/:id
// // @access  Private/Admin
// export const deleteProperty = asyncHandler(async (req, res) => {
//   const property = await Property.findById(req.params.id);

//   if (!property) {
//     throw new ErrorResponse('Property not found', 404);
//   }

//   // Only admins can reach this point (protected by requireAdmin middleware)
//   await Property.findByIdAndDelete(req.params.id);

//   res.status(200).json({
//     success: true,
//     message: 'Property deleted successfully'
//   });
// });

// // @desc    Get featured properties
// // @route   GET /api/properties/featured
// // @access  Public
// export const getFeaturedProperties = asyncHandler(async (req, res) => {
//   const properties = await Property.find({
//     isActive: true,
//     isFeatured: true
//   }).limit(6);

//   res.status(200).json({
//     success: true,
//     count: properties.length,
//     data: properties
//   });
// });

// // @desc    Get properties by agent
// // @route   GET /api/properties/agent/:agentId
// // @access  Public
// export const getPropertiesByAgent = asyncHandler(async (req, res) => {
//   const properties = await Property.find({
//     agentId: req.params.agentId, // Now using agentId (Firebase UID)
//     isActive: true
//   }).sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: properties.length,
//     data: properties
//   });
// });

// // @desc    Get my properties (for admin to see their own properties)
// // @route   GET /api/properties/my-properties
// // @access  Private/Admin
// export const getMyProperties = asyncHandler(async (req, res) => {
//   const properties = await Property.find({
//     agentId: req.user.uid // Current admin's Firebase UID
//   }).sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: properties.length,
//     data: properties
//   });
// });



import Property from '../models/Property.js';
import Upload from '../models/Upload.js'; // Add Upload model import
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
export const getProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    type,
    status,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    city,
    featured,
    search,
    location
  } = req.query;

  console.log('🔍 Query parameters received:', req.query);

  // Build filter object
  const filter = { isActive: true };

  // FIX: Make type filter case-insensitive
  if (type) {
    // Convert to lowercase to match database schema
    const typeLower = type.toLowerCase();
    console.log(`🏠 Type filter - Original: "${type}", Using: "${typeLower}"`);
    filter.type = typeLower;
  }
  
  if (status) filter.status = status;
  if (featured) filter.featured = featured === 'true';
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }
  
  // FIXED: Proper bedrooms filtering
  if (bedrooms) {
    const bedroomsNum = parseInt(bedrooms);
    console.log(`🛏️ Filtering by bedrooms: ${bedroomsNum}`);
    
    if (bedroomsNum >= 5) {
      filter['specifications.bedrooms'] = { $gte: 5 };
    } else {
      filter['specifications.bedrooms'] = bedroomsNum;
    }
  }
  
  if (bathrooms) filter['specifications.bathrooms'] = parseInt(bathrooms);
  
  if (city) filter['location.city'] = new RegExp(city, 'i');
  
  if (location) {
    filter.$or = [
      { 'location.address': new RegExp(location, 'i') },
      { 'location.city': new RegExp(location, 'i') },
      { 'location.state': new RegExp(location, 'i') },
      { 'location.country': new RegExp(location, 'i') }
    ];
  }
  
  if (search) {
    if (filter.$or) {
      filter.$or.push(
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      );
    } else {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') }
      ];
    }
  }

  console.log('🎯 Final filter object:', JSON.stringify(filter, null, 2));

  const properties = await Property.find(filter)
    .populate('images')
    .populate('featuredImage')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Property.countDocuments(filter);

  console.log(`✅ Found ${properties.length} properties matching filters`);
  
  // Debug: Log what types are actually being returned
  console.log('📊 Types of found properties:', properties.map(p => p.type));

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    },
    data: properties
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('images') // Populate image details
    .populate('featuredImage'); // Populate featured image

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private/Admin
export const createProperty = asyncHandler(async (req, res) => {
  const { images, featuredImage, ...propertyData } = req.body;

  // Validate that images exist if provided
  if (images && Array.isArray(images)) {
    // Check if all image IDs exist in the Upload collection
    const existingImages = await Upload.find({ _id: { $in: images } });
    if (existingImages.length !== images.length) {
      throw new ErrorResponse('One or more image IDs are invalid', 400);
    }
  }

  // Validate featuredImage if provided
  if (featuredImage) {
    const featuredImageExists = await Upload.findById(featuredImage);
    if (!featuredImageExists) {
      throw new ErrorResponse('Featured image ID is invalid', 400);
    }
  }

  // Add Firebase user info as agent/creator
  const finalPropertyData = {
    ...propertyData,
    images: images || [], // Ensure images array exists
    featuredImage: featuredImage || null,
    createdBy: req.user.uid, // Firebase UID
    agentId: req.user.uid,   // Firebase UID
    agentName: req.user.displayName || 'Admin',
    agentEmail: req.user.email,
    // Include any other agent info you want to store
    agentInfo: {
      name: req.user.displayName,
      email: req.user.email,
      photoURL: req.user.photoURL
    }
  };

  const property = await Property.create(finalPropertyData);

  // Populate the created property with image details
  await property.populate('images');
  await property.populate('featuredImage');

  res.status(201).json({
    success: true,
    data: property,
    message: 'Property created successfully'
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Admin
export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  const { images, featuredImage, ...updateData } = req.body;

  // Validate that images exist if provided
  if (images && Array.isArray(images)) {
    // Check if all image IDs exist in the Upload collection
    const existingImages = await Upload.find({ _id: { $in: images } });
    if (existingImages.length !== images.length) {
      throw new ErrorResponse('One or more image IDs are invalid', 400);
    }
    updateData.images = images;
  }

  // Validate featuredImage if provided
  if (featuredImage) {
    const featuredImageExists = await Upload.findById(featuredImage);
    if (!featuredImageExists) {
      throw new ErrorResponse('Featured image ID is invalid', 400);
    }
    updateData.featuredImage = featuredImage;
  }

  // Since we're using requireAdmin middleware, no need to check ownership
  // Only admins can reach this point
  property = await Property.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate('images').populate('featuredImage');

  res.status(200).json({
    success: true,
    data: property,
    message: 'Property updated successfully'
  });
});

// @desc    Update property images
// @route   PUT /api/properties/:id/images
// @access  Private/Admin
export const updatePropertyImages = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  const { imageIds, featuredImageId } = req.body;

  // Validate imageIds if provided
  if (imageIds && Array.isArray(imageIds)) {
    // Check if all image IDs exist in the Upload collection
    const existingImages = await Upload.find({ _id: { $in: imageIds } });
    if (existingImages.length !== imageIds.length) {
      throw new ErrorResponse('One or more image IDs are invalid', 400);
    }
  }

  // Validate featuredImageId if provided
  if (featuredImageId) {
    const featuredImageExists = await Upload.findById(featuredImageId);
    if (!featuredImageExists) {
      throw new ErrorResponse('Featured image ID is invalid', 400);
    }
  }

  // Update property images
  const updateData = {};
  if (imageIds) updateData.images = imageIds;
  if (featuredImageId) updateData.featuredImage = featuredImageId;

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate('images').populate('featuredImage');

  res.status(200).json({
    success: true,
    data: updatedProperty,
    message: 'Property images updated successfully'
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  // Only admins can reach this point (protected by requireAdmin middleware)
  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Property deleted successfully'
  });
});

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .populate('images')
    .populate('featuredImage')
    .limit(6);

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get properties by agent
// @route   GET /api/properties/agent/:agentId
// @access  Public
export const getPropertiesByAgent = asyncHandler(async (req, res) => {
  const properties = await Property.find({ 
    agentId: req.params.agentId, // Now using agentId (Firebase UID)
    isActive: true
  })
    .populate('images')
    .populate('featuredImage')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get my properties (for admin to see their own properties)
// @route   GET /api/properties/my-properties
// @access  Private/Admin
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ 
    agentId: req.user.uid // Current admin's Firebase UID
  })
    .populate('images')
    .populate('featuredImage')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Add images to property
// @route   POST /api/properties/:id/images
// @access  Private/Admin
export const addPropertyImages = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  const { imageIds } = req.body;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    throw new ErrorResponse('Image IDs array is required', 400);
  }

  // Check if all image IDs exist in the Upload collection
  const existingImages = await Upload.find({ _id: { $in: imageIds } });
  if (existingImages.length !== imageIds.length) {
    throw new ErrorResponse('One or more image IDs are invalid', 400);
  }

  // Add new images to property (avoid duplicates)
  const currentImages = property.images.map(img => img.toString());
  const newImages = imageIds.filter(imgId => !currentImages.includes(imgId.toString()));
  
  property.images = [...property.images, ...newImages];
  
  // If no featured image is set and we're adding images, set the first one as featured
  if (!property.featuredImage && newImages.length > 0) {
    property.featuredImage = newImages[0];
  }

  await property.save();
  await property.populate('images');
  await property.populate('featuredImage');

  res.status(200).json({
    success: true,
    data: property,
    message: 'Images added to property successfully'
  });
});

// @desc    Remove image from property
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private/Admin
export const removePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  const { imageId } = req.params;

  // Check if image exists in property
  const imageIndex = property.images.findIndex(img => img.toString() === imageId);
  if (imageIndex === -1) {
    throw new ErrorResponse('Image not found in property', 404);
  }

  // Remove image from property
  property.images.splice(imageIndex, 1);

  // If removed image was the featured image, clear featured image or set a new one
  if (property.featuredImage && property.featuredImage.toString() === imageId) {
    property.featuredImage = property.images.length > 0 ? property.images[0] : null;
  }

  await property.save();
  await property.populate('images');
  await property.populate('featuredImage');

  res.status(200).json({
    success: true,
    data: property,
    message: 'Image removed from property successfully'
  });
});

// @desc    Set featured image for property
// @route   PUT /api/properties/:id/featured-image
// @access  Private/Admin
export const setFeaturedImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  const { imageId } = req.body;

  if (!imageId) {
    throw new ErrorResponse('Image ID is required', 400);
  }

  // Check if image exists in property
  const imageExists = property.images.some(img => img.toString() === imageId);
  if (!imageExists) {
    throw new ErrorResponse('Image not found in property', 404);
  }

  // Check if image exists in Upload collection
  const imageInUpload = await Upload.findById(imageId);
  if (!imageInUpload) {
    throw new ErrorResponse('Image ID is invalid', 400);
  }

  property.featuredImage = imageId;
  await property.save();
  await property.populate('featuredImage');

  res.status(200).json({
    success: true,
    data: property,
    message: 'Featured image set successfully'
  });
});