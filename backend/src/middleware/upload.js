// import multer from 'multer';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import ErrorResponse from '../utils/ErrorResponse.js';

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   // Check file types
//   const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
//   const allowedDocTypes = /pdf|doc|docx|txt/;
  
//   const isImage = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
//   const isDocument = allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
//   const isMimeTypeValid = file.mimetype.startsWith('image/') ||
//                           file.mimetype === 'application/pdf' ||
//                           file.mimetype === 'application/msword' ||
//                           file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//                           file.mimetype === 'text/plain';

//   if (isMimeTypeValid && (isImage || isDocument)) {
//     cb(null, true);
//   } else {
//     cb(new ErrorResponse(
//       `Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and documents (PDF, DOC, DOCX, TXT) are allowed.`,
//       400
//     ), false);
//   }
// };

// // Configure multer
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//     files: 10 // Maximum 10 files
//   }
// });

// // Error handler for multer
// export const handleUploadError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return next(new ErrorResponse('File too large. Maximum size is 10MB.', 400));
//     }
//     if (err.code === 'LIMIT_FILE_COUNT') {
//       return next(new ErrorResponse('Too many files. Maximum is 10 files.', 400));
//     }
//     if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//       return next(new ErrorResponse('Unexpected field in file upload.', 400));
//     }
//   }
//   next(err);
// };

// middleware/upload.js - UPDATED WITH DEBUGGING
import multer from 'multer';
import ErrorResponse from '../utils/ErrorResponse.js';

// Configure storage - USE MEMORY STORAGE
const storage = multer.memoryStorage();

// File filter with detailed logging
const fileFilter = (req, file, cb) => {
  console.log('🔍 MULTER FILE FILTER - Checking file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    fieldname: file.fieldname
  });

  const allowedImageTypes = /jpeg|jpg|png|gif|webp/i;
  const allowedDocTypes = /pdf|doc|docx|txt/i;
  
  const isImage = allowedImageTypes.test(file.originalname);
  const isDocument = allowedDocTypes.test(file.originalname);
  const isMimeTypeValid = file.mimetype.startsWith('image/') || 
                          file.mimetype === 'application/pdf' ||
                          file.mimetype === 'application/msword' ||
                          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                          file.mimetype === 'text/plain';

  console.log('📊 File validation:', {
    isImage,
    isDocument,
    isMimeTypeValid,
    filename: file.originalname,
    mimetype: file.mimetype
  });

  if (isMimeTypeValid && (isImage || isDocument)) {
    console.log('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname);
    cb(new ErrorResponse(
      `Invalid file type: ${file.mimetype}. Only images (JPEG, PNG, GIF, WEBP) and documents (PDF, DOC, DOCX, TXT) are allowed.`,
      400
    ), false);
  }
};

// Create multer instance with debugging
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

console.log('✅ Multer middleware configured with memory storage');

export { upload };

// Enhanced error handler
export const handleUploadError = (err, req, res, next) => {
  console.error('❌ MULTER ERROR HANDLER:', {
    error: err.message,
    code: err.code,
    stack: err.stack
  });

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse('File too large. Maximum size is 10MB.', 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ErrorResponse('Too many files. Maximum is 10 files.', 400));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ErrorResponse('Unexpected field in file upload.', 400));
    }
    if (err.code === 'LIMIT_PART_COUNT') {
      return next(new ErrorResponse('Too many parts in form data.', 400));
    }
  }
  
  // If it's our custom ErrorResponse
  if (err instanceof ErrorResponse) {
    return next(err);
  }
  
  // Generic error
  console.error('❌ Unknown upload error:', err);
  next(new ErrorResponse('File upload failed', 500));
};