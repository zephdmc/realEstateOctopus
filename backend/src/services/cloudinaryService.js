// import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier';
// import ErrorResponse from '../utils/ErrorResponse.js';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // services/cloudinaryService.js - Update uploadToCloudinary function
// export const uploadToCloudinary = (file) => {
//   return new Promise((resolve, reject) => {
//     console.log('☁️ Starting Cloudinary upload for:', file.originalname);
//     console.log('📊 File details:', {
//       size: file.size,
//       mimetype: file.mimetype,
//       bufferSize: file.buffer?.length || 'No buffer'
//     });

//     // Check if buffer exists
//     if (!file.buffer) {
//       console.error('❌ No file buffer found - cannot upload to Cloudinary');
//       return reject(new ErrorResponse('File buffer is missing', 400));
//     }

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'auto',
//         folder: 'real-estate',
//         allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
//         transformation: [
//           { quality: 'auto', fetch_format: 'auto' }
//         ]
//       },
//       (error, result) => {
//         if (error) {
//           console.error('❌ Cloudinary upload error:', error);
//           console.error('❌ Cloudinary error details:', {
//             message: error.message,
//             http_code: error.http_code,
//             name: error.name
//           });
//           reject(new ErrorResponse(`Cloudinary upload failed: ${error.message}`, 500));
//         } else {
//           console.log('✅ Cloudinary upload successful:', {
//             public_id: result.public_id,
//             url: result.secure_url,
//             format: result.format,
//             bytes: result.bytes
//           });
//           resolve(result);
//         }
//       }
//     );

//     console.log('📤 Creating read stream from buffer...');
//     try {
//       const stream = streamifier.createReadStream(file.buffer);
//       stream.pipe(uploadStream);
//       console.log('✅ Stream piping successful');
//     } catch (streamError) {
//       console.error('❌ Stream creation error:', streamError);
//       reject(new ErrorResponse('Failed to create upload stream', 500));
//     }
//   });
// };
// // Upload multiple files
// export const uploadMultipleToCloudinary = async (files) => {
//   try {
//     const uploadPromises = files.map(file => uploadToCloudinary(file));
//     return await Promise.all(uploadPromises);
//   } catch (error) {
//     throw new ErrorResponse('Multiple file upload failed', 500);
//   }
// };

// // Delete file from Cloudinary
// export const deleteFromCloudinary = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     throw new ErrorResponse('File deletion failed', 500);
//   }
// };

// // Generate image URL with transformations
// export const generateImageUrl = (publicId, transformations = []) => {
//   return cloudinary.url(publicId, {
//     transformation: [
//       { quality: 'auto', fetch_format: 'auto' },
//       ...transformations
//     ]
//   });
// };

// // Upload base64 image
// export const uploadBase64Image = async (base64String, folder = 'real-estate') => {
//   try {
//     const result = await cloudinary.uploader.upload(base64String, {
//       folder,
//       resource_type: 'image'
//     });
//     return result;
//   } catch (error) {
//     throw new ErrorResponse('Base64 image upload failed', 500);
//   }
// };
// services/cloudinaryService.js - WORKING HARDCODED VERSION
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import ErrorResponse from '../utils/ErrorResponse.js';

// IMMEDIATE FIX: Hardcode Cloudinary credentials
console.log('🔧 Using hardcoded Cloudinary configuration');
cloudinary.config({
  cloud_name: 'dy6ikry7c',
  api_key: '183365955416328',
  api_secret: 'i6OuZE9kKE4a2cpDRPOmVXqsyVc'
});
console.log('✅ Cloudinary configured successfully');

// Upload file to Cloudinary
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    console.log('☁️ Starting Cloudinary upload for:', file.originalname);
    console.log('📊 File details:', {
      size: file.size,
      mimetype: file.mimetype,
      bufferSize: file.buffer?.length || 'No buffer'
    });

    // Check if buffer exists
    if (!file.buffer) {
      console.error('❌ No file buffer found - cannot upload to Cloudinary');
      return reject(new ErrorResponse('File buffer is missing', 400));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'real-estate',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          console.error('❌ Cloudinary error details:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name
          });
          reject(new ErrorResponse(`Cloudinary upload failed: ${error.message}`, 500));
        } else {
          console.log('✅ Cloudinary upload successful:', {
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            bytes: result.bytes
          });
          resolve(result);
        }
      }
    );

    console.log('📤 Creating read stream from buffer...');
    try {
      const stream = streamifier.createReadStream(file.buffer);
      stream.pipe(uploadStream);
      console.log('✅ Stream piping successful');
    } catch (streamError) {
      console.error('❌ Stream creation error:', streamError);
      reject(new ErrorResponse('Failed to create upload stream', 500));
    }
  });
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (files) => {
  try {
    console.log(`☁️ Starting multiple upload for ${files.length} files`);
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('❌ Multiple file upload failed:', error);
    throw new ErrorResponse('Multiple file upload failed', 500);
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('✅ Cloudinary deletion result:', result);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary deletion failed:', error);
    throw new ErrorResponse('File deletion failed', 500);
  }
};

// Generate image URL with transformations
export const generateImageUrl = (publicId, transformations = []) => {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      ...transformations
    ]
  });
};

// Upload base64 image
export const uploadBase64Image = async (base64String, folder = 'real-estate') => {
  try {
    console.log('☁️ Uploading base64 image');
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: 'image'
    });
    console.log('✅ Base64 upload successful:', result.public_id);
    return result;
  } catch (error) {
    console.error('❌ Base64 image upload failed:', error);
    throw new ErrorResponse('Base64 image upload failed', 500);
  }
};