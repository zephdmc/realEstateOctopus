// frontend/src/services/uploadService.js
import { uploadAPI } from './api.js';

class UploadService {
  /**
   * Upload single file
   * @param {File} file - The file to upload
   * @param {string} category - File category (property, blog, profile, etc.)
   * @param {string} description - File description
   * @param {string[]} tags - File tags
   * @returns {Promise} Upload response
   */
  async uploadFile(file, category = 'property', description = '', tags = []) {
    try {
      console.log(`📤 Uploading single file: ${file.name}`, { 
        category, 
        size: file.size,
        type: file.type 
      });

      const response = await uploadAPI.uploadFile(file, category, description, tags);
      
      console.log('✅ File upload successful:', response.data);
      return response;
    } catch (error) {
      console.error('❌ File upload failed:', error);
      throw this._enhanceError(error, 'uploadFile');
    }
  }

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   * @param {string} category - File category
   * @param {string} description - File description
   * @param {string[]} tags - File tags
   * @param {function} onProgress - Progress callback
   * @returns {Promise} Upload response
   */
 // frontend/src/services/uploadService.js

async uploadMultipleFiles(files, category = 'property', description = '', tags = [], onProgress = null) {
    try {
      if (!files || !Array.isArray(files) || files.length === 0) {
        throw new Error('No files provided for upload');
      }
  
      console.log(`📤 Uploading ${files.length} files`, { 
        category, 
        fileNames: files.map(f => f.name),
        totalSize: this._formatFileSize(files.reduce((acc, file) => acc + file.size, 0))
      });
  
      const response = await uploadAPI.uploadMultipleFiles(files, category, description, tags, onProgress);
      
      // FIX: Handle different response structures
      let uploadedFiles = [];
      
      if (Array.isArray(response.data)) {
        uploadedFiles = response.data;
      } else if (response.data && Array.isArray(response.data.files)) {
        uploadedFiles = response.data.files;
      } else if (Array.isArray(response)) {
        uploadedFiles = response; // If API returns array directly
      } else if (response && response.files) {
        uploadedFiles = response.files;
      } else {
        console.warn('Unexpected response format:', response);
        throw new Error('Invalid response format from upload API');
      }
  
      console.log('✅ Multiple files upload successful:', {
        count: uploadedFiles.length,
        files: uploadedFiles.map(f => f.originalName || f.name)
      });
      
      // Return consistent structure
      return {
        data: uploadedFiles,
        success: true,
        count: uploadedFiles.length
      };
      
    } catch (error) {
      console.error('❌ Multiple files upload failed:', error);
      throw this._enhanceError(error, 'uploadMultipleFiles');
    }
  }

  /**
   * Upload files with progress tracking
   * @param {File[]} files - Array of files to upload
   * @param {string} category - File category
   * @param {function} onProgress - Progress callback (percent: number) => void
   * @returns {Promise} Upload response
   */
  async uploadWithProgress(files, category = 'property', onProgress = null) {
    return this.uploadMultipleFiles(files, category, '', [], onProgress);
  }

  /**
   * Get all uploads with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.category - Filter by category
   * @param {string} params.search - Search term
   * @returns {Promise} Uploads response
   */
  async getUploads(params = {}) {
    try {
      console.log('🔍 Fetching uploads with params:', params);
      
      const response = await uploadAPI.getUploads(params);
      
      console.log('✅ Fetched uploads:', {
        count: response.data.length,
        total: response.total,
        category: params.category
      });
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch uploads:', error);
      throw this._enhanceError(error, 'getUploads');
    }
  }

  /**
   * Get single upload by ID
   * @param {string} id - Upload ID
   * @returns {Promise} Upload response
   */
  async getUpload(id) {
    try {
      if (!id) {
        throw new Error('Upload ID is required');
      }

      console.log(`🔍 Fetching upload: ${id}`);
      
      const response = await uploadAPI.getUpload(id);
      
      console.log('✅ Fetched upload:', response.data.originalName);
      return response;
    } catch (error) {
      console.error(`❌ Failed to fetch upload ${id}:`, error);
      throw this._enhanceError(error, 'getUpload');
    }
  }

  /**
   * Update upload details
   * @param {string} id - Upload ID
   * @param {Object} updates - Update data
   * @param {string} updates.description - New description
   * @param {string[]} updates.tags - New tags
   * @param {boolean} updates.isPublic - Privacy setting
   * @returns {Promise} Updated upload response
   */
  async updateUpload(id, updates) {
    try {
      if (!id) {
        throw new Error('Upload ID is required');
      }

      console.log(`✏️ Updating upload ${id}:`, updates);
      
      const response = await uploadAPI.updateUpload(id, updates);
      
      console.log('✅ Upload updated successfully:', response.data.originalName);
      return response;
    } catch (error) {
      console.error(`❌ Failed to update upload ${id}:`, error);
      throw this._enhanceError(error, 'updateUpload');
    }
  }

  /**
   * Delete upload
   * @param {string} id - Upload ID
   * @returns {Promise} Delete response
   */
  async deleteUpload(id) {
    try {
      if (!id) {
        throw new Error('Upload ID is required');
      }

      console.log(`🗑️ Deleting upload: ${id}`);
      
      const response = await uploadAPI.deleteUpload(id);
      
      console.log('✅ Upload deleted successfully');
      return response;
    } catch (error) {
      console.error(`❌ Failed to delete upload ${id}:`, error);
      throw this._enhanceError(error, 'deleteUpload');
    }
  }

  /**
   * Get uploads by category
   * @param {string} category - Category to filter by
   * @param {number} limit - Maximum number of uploads to return
   * @returns {Promise} Uploads response
   */
  async getUploadsByCategory(category, limit = 50) {
    return this.getUploads({ category, limit });
  }

  /**
   * Search uploads
   * @param {string} searchTerm - Search term
   * @param {string} category - Optional category filter
   * @returns {Promise} Uploads response
   */
  async searchUploads(searchTerm, category = null) {
    const params = { search: searchTerm };
    if (category) params.category = category;
    
    return this.getUploads(params);
  }

  /**
   * Get user's property images
   * @param {number} limit - Maximum number of images
   * @returns {Promise} Property images response
   */
  async getMyPropertyImages(limit = 100) {
    return this.getUploads({ 
      category: 'property', 
      limit 
    });
  }

  /**
   * Get user's blog images
   * @param {number} limit - Maximum number of images
   * @returns {Promise} Blog images response
   */
  async getMyBlogImages(limit = 100) {
    return this.getUploads({ 
      category: 'blog', 
      limit 
    });
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @param {number} options.maxSize - Maximum file size in bytes
   * @param {string[]} options.allowedTypes - Allowed MIME types
   * @returns {Object} Validation result
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size too large. Maximum: ${this._formatFileSize(maxSize)}`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`);
    }

    // Check if file is an image (for additional validation)
    if (!file.type.startsWith('image/')) {
      errors.push('Only image files are allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        formattedSize: this._formatFileSize(file.size)
      }
    };
  }

  /**
   * Validate multiple files
   * @param {File[]} files - Files to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFiles(files, options = {}) {
    const results = files.map(file => this.validateFile(file, options));
    const allValid = results.every(result => result.isValid);
    const allErrors = results.flatMap(result => result.errors);

    return {
      isValid: allValid,
      errors: allErrors,
      results: results,
      validFiles: allValid ? files : files.filter((_, index) => results[index].isValid),
      invalidFiles: files.filter((_, index) => !results[index].isValid)
    };
  }

  /**
   * Process files before upload (validation and filtering)
   * @param {File[]} files - Files to process
   * @param {Object} options - Validation options
   * @returns {Object} Processing result
   */
  processFiles(files, options = {}) {
    const validation = this.validateFiles(files, options);

    if (!validation.isValid) {
      console.warn('⚠️ Some files failed validation:', {
        valid: validation.validFiles.length,
        invalid: validation.invalidFiles.length,
        errors: validation.errors
      });
    }

    return {
      ...validation,
      totalSize: this._formatFileSize(files.reduce((acc, file) => acc + file.size, 0)),
      canUpload: validation.validFiles.length > 0
    };
  }

  /**
   * Upload images for property with automatic processing
   * @param {File[]} files - Image files
   * @param {function} onProgress - Progress callback
   * @returns {Promise} Upload response
   */
  async uploadPropertyImages(files, onProgress = null) {
    // Process and validate files first
    const processed = this.processFiles(files, {
      maxSize: 5 * 1024 * 1024, // 5MB for property images
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (!processed.canUpload) {
      throw new Error(`No valid files to upload. Errors: ${processed.errors.join(', ')}`);
    }

    console.log(`🏠 Uploading ${processed.validFiles.length} property images`);

    return this.uploadWithProgress(processed.validFiles, 'property', onProgress);
  }

  /**
   * Upload images for blog with automatic processing
   * @param {File[]} files - Image files
   * @param {function} onProgress - Progress callback
   * @returns {Promise} Upload response
   */
  async uploadBlogImages(files, onProgress = null) {
    const processed = this.processFiles(files, {
      maxSize: 5 * 1024 * 1024, // 5MB for blog images
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    });

    if (!processed.canUpload) {
      throw new Error(`No valid files to upload. Errors: ${processed.errors.join(', ')}`);
    }

    console.log(`📝 Uploading ${processed.validFiles.length} blog images`);

    return this.uploadWithProgress(processed.validFiles, 'blog', onProgress);
  }

  /**
   * Upload profile picture
   * @param {File} file - Profile image file
   * @returns {Promise} Upload response
   */
  async uploadProfilePicture(file) {
    const validation = this.validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB for profile pictures
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (!validation.isValid) {
      throw new Error(`Profile picture validation failed: ${validation.errors.join(', ')}`);
    }

    console.log(`👤 Uploading profile picture: ${file.name}`);

    return this.uploadFile(file, 'profile', 'Profile picture');
  }

  // Private helper methods

  /**
   * Enhance error with additional context
   * @param {Error} error - Original error
   * @param {string} method - Method name where error occurred
   * @returns {Error} Enhanced error
   */
//   _enhanceError(error, method) {
//     const enhancedError = new Error(error.message || 'Upload service error');
//     enhancedError.originalError = error;
//     enhancedError.method = method;
//     enhancedError.timestamp = new Date().toISOString();
//     enhancedError.status = error.status;
//     enhancedError.code = error.code;

//     return enhancedError;
//   }
_enhanceError(error, method) {
    console.error(`Upload Service Error in ${method}:`, {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response,
      data: error.data
    });
  
    const enhancedError = new Error(error.message || 'Upload service error');
    enhancedError.originalError = error;
    enhancedError.method = method;
    enhancedError.timestamp = new Date().toISOString();
    enhancedError.status = error.status;
    enhancedError.code = error.code;
    
    // Add response data if available
    if (error.response) {
      enhancedError.responseData = error.response.data;
    }
  
    return enhancedError;
  }
  /**
   * Format file size to human readable string
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  _formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate file preview URL
   * @param {File} file - File object
   * @returns {Promise<string>} Data URL for preview
   */
  generateFilePreview(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get file type category
   * @param {string} mimeType - MIME type
   * @returns {string} File category
   */
  getFileCategory(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    return 'other';
  }
}

// Create and export singleton instance
export const uploadService = new UploadService();
export default uploadService;