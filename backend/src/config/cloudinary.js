// Cloudinary configuration
const cloudinaryConfig = {
    // Cloudinary credentials
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  
    // Upload settings
    upload: {
      // Default folder for uploads
      folder: 'real-estate',
      
      // Allowed formats
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
      
      // Image transformations
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
      
      // Resource type
      resource_type: 'auto',
      
      // Maximum file size (10MB)
      max_file_size: 10 * 1024 * 1024
    },
  
    // Image optimization settings
    optimization: {
      // Default transformations for different use cases
      thumb: {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto'
      },
      
      medium: {
        width: 800,
        height: 600,
        crop: 'limit',
        quality: 'auto'
      },
      
      large: {
        width: 1200,
        height: 800,
        crop: 'limit',
        quality: 'auto'
      }
    },
  
    // Responsive breakpoints
    responsive_breakpoints: {
      create_derived: true,
      bytes_step: 20000,
      min_width: 200,
      max_width: 1200,
      max_images: 4
    }
  };
  
  export default cloudinaryConfig;