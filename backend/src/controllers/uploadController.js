// import Upload from '../models/Upload.js';
// import asyncHandler from '../utils/asyncHandler.js';
// import ErrorResponse from '../utils/ErrorResponse.js';
// import { uploadToCloudinary } from '../services/cloudinaryService.js';

// // @desc    Upload file
// // @route   POST /api/upload
// // @access  Private
// export const uploadFile = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     throw new ErrorResponse('Please upload a file', 400);
//   }

//   // Upload to Cloudinary
//   const uploadResult = await uploadToCloudinary(req.file);

//   // Save to database
//   const upload = await Upload.create({
//     filename: uploadResult.public_id,
//     originalName: req.file.originalname,
//     mimetype: req.file.mimetype,
//     size: req.file.size,
//     path: req.file.path,
//     url: uploadResult.secure_url,
//     cloudinaryId: uploadResult.public_id,
//     uploadedBy: req.user.id,
//     category: req.body.category || 'other',
//     description: req.body.description,
//     tags: req.body.tags ? req.body.tags.split(',') : []
//   });

//   res.status(201).json({
//     success: true,
//     data: upload
//   });
// });

// // @desc    Upload multiple files
// // @route   POST /api/upload/multiple
// // @access  Private
// export const uploadMultipleFiles = asyncHandler(async (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     throw new ErrorResponse('Please upload files', 400);
//   }

//   const uploads = [];

//   for (const file of req.files) {
//     const uploadResult = await uploadToCloudinary(file);

//     const upload = await Upload.create({
//       filename: uploadResult.public_id,
//       originalName: file.originalname,
//       mimetype: file.mimetype,
//       size: file.size,
//       path: file.path,
//       url: uploadResult.secure_url,
//       cloudinaryId: uploadResult.public_id,
//       uploadedBy: req.user.id,
//       category: req.body.category || 'other',
//       description: req.body.description,
//       tags: req.body.tags ? req.body.tags.split(',') : []
//     });

//     uploads.push(upload);
//   }

//   res.status(201).json({
//     success: true,
//     count: uploads.length,
//     data: uploads
//   });
// });

// // @desc    Get all uploads
// // @route   GET /api/upload
// // @access  Private
// export const getUploads = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 20,
//     category,
//     search
//   } = req.query;

//   // Build filter object
//   const filter = {};

//   if (category) filter.category = category;
  
//   if (search) {
//     filter.$or = [
//       { originalName: new RegExp(search, 'i') },
//       { description: new RegExp(search, 'i') },
//       { tags: new RegExp(search, 'i') }
//     ];
//   }

//   // If user is not admin, only show their uploads
//   if (req.user.role !== 'admin') {
//     filter.uploadedBy = req.user.id;
//   }

//   // Execute query with pagination
//   const uploads = await Upload.find(filter)
//     .populate('uploadedBy', 'name email')
//     .limit(limit * 1)
//     .skip((page - 1) * limit)
//     .sort({ createdAt: -1 });

//   // Get total count for pagination
//   const total = await Upload.countDocuments(filter);

//   res.status(200).json({
//     success: true,
//     count: uploads.length,
//     total,
//     pagination: {
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       limit: parseInt(limit)
//     },
//     data: uploads
//   });
// });

// // @desc    Get single upload
// // @route   GET /api/upload/:id
// // @access  Private
// export const getUpload = asyncHandler(async (req, res) => {
//   const upload = await Upload.findById(req.params.id)
//     .populate('uploadedBy', 'name email');

//   if (!upload) {
//     throw new ErrorResponse('Upload not found', 404);
//   }

//   // Check if user is authorized to view this upload
//   if (req.user.role !== 'admin' && upload.uploadedBy._id.toString() !== req.user.id) {
//     throw new ErrorResponse('Not authorized to view this upload', 403);
//   }

//   res.status(200).json({
//     success: true,
//     data: upload
//   });
// });

// // @desc    Delete upload
// // @route   DELETE /api/upload/:id
// // @access  Private
// export const deleteUpload = asyncHandler(async (req, res) => {
//   const upload = await Upload.findById(req.params.id);

//   if (!upload) {
//     throw new ErrorResponse('Upload not found', 404);
//   }

//   // Check if user is authorized to delete this upload
//   if (req.user.role !== 'admin' && upload.uploadedBy.toString() !== req.user.id) {
//     throw new ErrorResponse('Not authorized to delete this upload', 403);
//   }

//   // Delete from Cloudinary (implementation depends on your Cloudinary service)
//   // await deleteFromCloudinary(upload.cloudinaryId);

//   await Upload.findByIdAndDelete(req.params.id);

//   res.status(200).json({
//     success: true,
//     message: 'File deleted successfully'
//   });
// });

// // @desc    Update upload details
// // @route   PUT /api/upload/:id
// // @access  Private
// export const updateUpload = asyncHandler(async (req, res) => {
//   let upload = await Upload.findById(req.params.id);

//   if (!upload) {
//     throw new ErrorResponse('Upload not found', 404);
//   }

//   // Check if user is authorized to update this upload
//   if (req.user.role !== 'admin' && upload.uploadedBy.toString() !== req.user.id) {
//     throw new ErrorResponse('Not authorized to update this upload', 403);
//   }

//   upload = await Upload.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true
//     }
//   ).populate('uploadedBy', 'name email');

//   res.status(200).json({
//     success: true,
//     data: upload
//   });
// });


// controllers/uploadController.js
import Upload from '../models/Upload.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

// @desc    Upload file
// @route   POST /api/upload
// @access  Public (Temporarily)
export const uploadFile = asyncHandler(async (req, res) => {
  console.log('📤 Upload File - Starting...');
  console.log('📁 Request file:', {
    originalname: req.file?.originalname,
    mimetype: req.file?.mimetype,
    size: req.file?.size,
    buffer: req.file?.buffer ? `Buffer (${req.file.buffer.length} bytes)` : 'No buffer'
  });
  console.log('📝 Request body:', req.body);

  if (!req.file) {
    throw new ErrorResponse('Please upload a file', 400);
  }

  try {
    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const uploadResult = await uploadToCloudinary(req.file);
    console.log('✅ Cloudinary upload successful:', uploadResult.public_id);

    // Save to database - use temp user since auth is disabled
    console.log('💾 Saving to database...');
    const upload = await Upload.create({
      filename: uploadResult.public_id,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: null, // ← CHANGED: No local path with memory storage
      url: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id, // ← ADDED
      uploadedBy: req.user?.id || 'temp-user-id',
      category: req.body.category || 'property',
      description: req.body.description,
      tags: req.body.tags ? req.body.tags.split(',') : []
    });

    console.log('✅ Database save successful:', upload._id);

    res.status(201).json({
      success: true,
      data: upload
    });

  } catch (error) {
    console.error('💥 Upload file error:', error);
    throw error;
  }
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Public (Temporarily)
// controllers/uploadController.js - Update the uploadMultipleFiles function
// In your uploadMultipleFiles controller - TEMPORARY FIX
export const uploadMultipleFiles = asyncHandler(async (req, res) => {
  console.log('🎯 UPLOAD MULTIPLE - STARTING');
  
  if (!req.files || req.files.length === 0) {
    throw new ErrorResponse('Please upload files', 400);
  }

  // TEMPORARY: Hardcode user ID since auth is disabled
  const uploadedBy = 'temp-user-id-123';
  console.log('👤 Using temp user:', uploadedBy);

  try {
    const uploads = [];
    
    for (const file of req.files) {
      console.log(`📤 Uploading: ${file.originalname}`);
      
      const uploadResult = await uploadToCloudinary(file);
      console.log('✅ Cloudinary done:', uploadResult.public_id);
      
      // Simple database save
      const upload = await Upload.create({
        filename: uploadResult.public_id,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: null,
        url: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        uploadedBy: uploadedBy, // Use hardcoded ID
        category: req.body.category || 'property'
      });
      
      uploads.push(upload);
    }
    
    res.json({
      success: true,
      count: uploads.length,
      data: uploads
    });
    
  } catch (error) {
    console.error('💥 Controller error:', error);
    throw error;
  }
});

// ... rest of your controller remains the same
// @desc    Get all uploads
// @route   GET /api/upload
// @access  Public (Temporarily)
export const getUploads = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    search
  } = req.query;

  console.log('🔍 Get Uploads - Query:', { page, limit, category, search });

  // Build filter object
  const filter = {};

  if (category) filter.category = category;
  
  if (search) {
    filter.$or = [
      { originalName: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ];
  }

  // TEMPORARY: Since auth is disabled, show all uploads
  // if (req.user.role !== 'admin') {
  //   filter.uploadedBy = req.user.id;
  // }

  try {
    // Execute query with pagination
    const uploads = await Upload.find(filter)
      .populate('uploadedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Upload.countDocuments(filter);

    console.log('✅ Get uploads successful:', uploads.length);

    res.status(200).json({
      success: true,
      count: uploads.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: uploads
    });

  } catch (error) {
    console.error('❌ Get uploads error:', error);
    throw error;
  }
});

// @desc    Get single upload
// @route   GET /api/upload/:id
// @access  Public (Temporarily)
export const getUpload = asyncHandler(async (req, res) => {
  console.log('🔍 Get Upload:', req.params.id);

  const upload = await Upload.findById(req.params.id)
    .populate('uploadedBy', 'name email');

  if (!upload) {
    throw new ErrorResponse('Upload not found', 404);
  }

  // TEMPORARY: Skip auth check
  // if (req.user.role !== 'admin' && upload.uploadedBy._id.toString() !== req.user.id) {
  //   throw new ErrorResponse('Not authorized to view this upload', 403);
  // }

  res.status(200).json({
    success: true,
    data: upload
  });
});

// @desc    Delete upload
// @route   DELETE /api/upload/:id
// @access  Public (Temporarily)
export const deleteUpload = asyncHandler(async (req, res) => {
  console.log('🗑️ Delete Upload:', req.params.id);

  const upload = await Upload.findById(req.params.id);

  if (!upload) {
    throw new ErrorResponse('Upload not found', 404);
  }

  // TEMPORARY: Skip auth check
  // if (req.user.role !== 'admin' && upload.uploadedBy.toString() !== req.user.id) {
  //   throw new ErrorResponse('Not authorized to delete this upload', 403);
  // }

  // Delete from Cloudinary (implementation depends on your Cloudinary service)
  // await deleteFromCloudinary(upload.cloudinaryId);

  await Upload.findByIdAndDelete(req.params.id);

  console.log('✅ Upload deleted successfully');

  res.status(200).json({
    success: true,
    message: 'File deleted successfully'
  });
});

// @desc    Update upload details
// @route   PUT /api/upload/:id
// @access  Public (Temporarily)
export const updateUpload = asyncHandler(async (req, res) => {
  console.log('✏️ Update Upload:', req.params.id, req.body);

  let upload = await Upload.findById(req.params.id);

  if (!upload) {
    throw new ErrorResponse('Upload not found', 404);
  }

  // TEMPORARY: Skip auth check
  // if (req.user.role !== 'admin' && upload.uploadedBy.toString() !== req.user.id) {
  //   throw new ErrorResponse('Not authorized to update this upload', 403);
  // }

  upload = await Upload.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('uploadedBy', 'name email');

  console.log('✅ Upload updated successfully');

  res.status(200).json({
    success: true,
    data: upload
  });
});