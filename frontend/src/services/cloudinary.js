import { apiService } from './api';

class CloudinaryService {
  constructor() {
    this.cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    this.apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
    this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;
  }

  // Upload image to Cloudinary
  async uploadImage(file, options = {}) {
    const {
      folder = 'estatepro',
      transformation = [],
      tags = [],
      onProgress = null,
    } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);
    
    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }

    if (transformation.length > 0) {
      formData.append('transformation', transformation.join(','));
    }

    try {
      const response = await apiService.upload(
        `${this.baseUrl}/image/upload`,
        formData,
        onProgress
      );

      return {
        success: true,
        data: {
          publicId: response.public_id,
          url: response.secure_url,
          format: response.format,
          width: response.width,
          height: response.height,
          bytes: response.bytes,
          createdAt: response.created_at,
        },
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      };
    }
  }

  // Upload multiple images
  async uploadImages(files, options = {}) {
    const uploadPromises = files.map(file => this.uploadImage(file, options));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      return {
        success: true,
        data: successfulUploads.map(result => result.data),
        failed: failedUploads,
        total: files.length,
        successful: successfulUploads.length,
        failedCount: failedUploads.length,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to upload one or more images',
      };
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      const timestamp = Math.round((new Date()).getTime() / 1000);
      const signature = await this.generateSignature(publicId, timestamp);

      const params = {
        public_id: publicId,
        timestamp,
        signature,
        api_key: this.apiKey,
      };

      await apiService.post(`${this.baseUrl}/image/destroy`, params);
      
      return { success: true };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image',
      };
    }
  }

  // Generate transformation URL
  generateImageUrl(publicId, transformation = {}) {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
    } = transformation;

    const transformations = [];

    if (width && height) {
      transformations.push(`c_${crop},w_${width},h_${height}`);
    } else if (width) {
      transformations.push(`w_${width}`);
    } else if (height) {
      transformations.push(`h_${height}`);
    }

    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformationString = transformations.join(',');

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformationString}/${publicId}`;
  }

  // Generate signature for secure operations (would typically be done server-side)
  async generateSignature(publicId, timestamp) {
    // In a production environment, this should be done on the server
    // to keep your API secret secure
    try {
      const response = await apiService.post('/api/cloudinary/signature', {
        publicId,
        timestamp,
      });

      return response.signature;
    } catch (error) {
      throw new Error('Failed to generate signature');
    }
  }

  // Optimize image for web
  optimizeForWeb(publicId, width = 1200) {
    return this.generateImageUrl(publicId, {
      width,
      quality: 'auto',
      format: 'webp',
    });
  }

  // Generate thumbnail URL
  generateThumbnail(publicId, width = 300, height = 200) {
    return this.generateImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    });
  }

  // Generate responsive image srcset
  generateSrcSet(publicId, breakpoints = [400, 800, 1200, 1600]) {
    return breakpoints
      .map(width => `${this.generateImageUrl(publicId, { width, crop: 'scale' })} ${width}w`)
      .join(', ');
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;