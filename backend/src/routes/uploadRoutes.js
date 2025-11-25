// // import express from 'express';
// // import {
// //   uploadFile,
// //   uploadMultipleFiles,
// //   getUploads,
// //   getUpload,
// //   deleteUpload,
// //   updateUpload
// // } from '../controllers/uploadController.js';
// // import { protect, authorize } from '../middleware/auth.js';
// // import { upload } from '../middleware/upload.js';

// // const router = express.Router();

// // // All routes are protected
// // router.use(protect);

// // router.route('/')
// //   .get(getUploads)
// //   .post(upload.single('file'), uploadFile);

// // router.route('/multiple')
// //   .post(upload.array('files', 10), uploadMultipleFiles);

// // router.route('/:id')
// //   .get(getUpload)
// //   .put(updateUpload)
// //   .delete(deleteUpload);

// // export default router;


// // routes/uploadRoutes.js
// import express from 'express';
// import {
//   uploadFile,
//   uploadMultipleFiles,
//   getUploads,
//   getUpload,
//   deleteUpload,
//   updateUpload
// } from '../controllers/uploadController.js';
// // import { protect, authorize } from '../middleware/auth.js'; // Comment out for now
// import { upload } from '../middleware/upload.js';

// const router = express.Router();

// // TEMPORARY: Comment out protection for testing
// // All routes are protected
// // router.use(protect);

// router.route('/')
//   .get(getUploads)
//   .post(upload.single('file'), uploadFile);

// router.route('/multiple')
//   .post(upload.array('files', 10), uploadMultipleFiles);

// router.route('/:id')
//   .get(getUpload)
//   .put(updateUpload)
//   .delete(deleteUpload);

// export default router;


// routes/upload.js - SIMPLE WORKING VERSION
import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadMultipleFiles } from '../controllers/uploadController.js';

const router = express.Router();

// Test route - should work
router.get('/test-route', (req, res) => {
  console.log('✅ TEST ROUTE: Working');
  res.json({ 
    success: true, 
    message: 'Routes are working',
    timestamp: new Date().toISOString()
  });
});

// Simple upload test
router.post('/test-simple', upload.array('files'), async (req, res) => {
  console.log('🧪 SIMPLE TEST: Starting');
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log('✅ Multer success, files:', req.files.length);
    
    const file = req.files[0];
    console.log('📁 File:', file.originalname, file.size, 'bytes');
    
    // Test Cloudinary
    console.log('☁️ Testing Cloudinary...');
    const { uploadToCloudinary } = await import('../services/cloudinaryService.js');
    const result = await uploadToCloudinary(file);
    
    console.log('✅ Cloudinary success:', result.public_id);
    
    res.json({
      success: true,
      message: 'Simple upload test passed',
      cloudinary: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });
    
  } catch (error) {
    console.error('❌ Simple test failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Main upload route - SIMPLE VERSION
router.post('/multiple', upload.array('files'), async (req, res) => {
  console.log('🎯 MAIN ROUTE: Starting');
  
  try {
    console.log('📁 Files received:', req.files?.length || 0);
    
    if (req.files) {
      req.files.forEach((file, index) => {
        console.log(`📄 File ${index + 1}:`, {
          originalname: file.originalname,
          size: file.size,
          buffer: file.buffer ? `Buffer (${file.buffer.length} bytes)` : 'No buffer'
        });
      });
    }
    
    // Call the controller
    await uploadMultipleFiles(req, res);
    
  } catch (error) {
    console.error('❌ Main route error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Other routes (simplified)
router.route('/')
  .get((req, res) => res.json({ message: 'GET /upload' }))
  .post(upload.single('file'), (req, res) => res.json({ message: 'POST /upload' }));

router.route('/:id')
  .get((req, res) => res.json({ message: 'GET /upload/:id' }))
  .put((req, res) => res.json({ message: 'PUT /upload/:id' }))
  .delete((req, res) => res.json({ message: 'DELETE /upload/:id' }));

export default router;