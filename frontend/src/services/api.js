import axios from 'axios';
import { getAuth } from 'firebase/auth';

// In your api.js, update the baseURL:
const api = axios.create({
  baseURL: 'https://corsproxy.io/?' + encodeURIComponent('https://realestateoctopus-production.up.railway.app/api'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Added Firebase token to request');
      } else {
        console.warn('⚠️ No Firebase user found for request');
      }
    } catch (error) {
      console.warn('❌ Failed to get auth token:', error);
    }
    
    // Add timestamp to avoid caching
    if (config.method === 'get' && config.params) {
      config.params._t = Date.now();
    }
    
    // Log request details for debugging
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} SUCCESS:`, response.data);
    return response;
  },
  (error) => {
    const { response, config } = error;
    
    console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url} FAILED:`, {
      status: response?.status,
      message: error.message,
      data: response?.data,
      url: config?.url
    });
    
    if (response) {
      switch (response.status) {
        case 400:
          console.error('🔍 400 Validation Errors:', response.data);
          if (response.data?.errors) {
            console.error('📋 Field-specific errors:', response.data.errors);
          }
          break;
        case 401:
          console.warn('🔐 Unauthorized access - please login again');
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/admin')) {
            window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
          } else {
            console.log('📍 On admin page, not redirecting to login');
          }
          break;
        case 403:
          console.error('🚫 Access forbidden:', response.data?.message);
          break;
        case 404:
          console.error('🔍 Resource not found:', config?.url);
          break;
        case 409:
          console.error('⚡ Conflict:', response.data?.message);
          break;
        case 422:
          console.error('📝 Validation failed:', response.data?.errors);
          break;
        case 429:
          console.error('⏰ Rate limit exceeded:', response.data?.message);
          break;
        case 500:
          console.error('💥 Server error:', response.data?.message);
          break;
        case 502:
          console.error('🌐 Bad Gateway - Server may be down');
          break;
        case 503:
          console.error('🔧 Service Unavailable - Server maintenance');
          break;
        default:
          console.error('❓ API error:', response.data?.message);
      }
    } else {
      console.error('🌐 Network error:', error.message);
    }
    
    // Return enhanced error object for better debugging
    return Promise.reject({
      message: response?.data?.message || error.message,
      status: response?.status,
      code: response?.data?.code,
      errors: response?.data?.errors,
      data: response?.data,
      url: config?.url,
      method: config?.method,
      timestamp: new Date().toISOString()
    });
  }
);

// API methods
export const apiService = {
  // GET request
  get: (url, params = {}, config = {}) => 
    api.get(url, { params, ...config }),

  // POST request
  post: (url, data = {}, config = {}) => 
    api.post(url, data, config),

  // PUT request
  put: (url, data = {}, config = {}) => 
    api.put(url, data, config),

  // PATCH request
  patch: (url, data = {}, config = {}) => 
    api.patch(url, data, config),

  // DELETE request
  delete: (url, config = {}) => 
    api.delete(url, config),

  // Upload file with enhanced progress tracking
  upload: (url, formData, onProgress = null, config = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📤 Upload progress: ${percentCompleted}%`);
          onProgress(percentCompleted);
        }
      },
      timeout: 60000, // Longer timeout for file uploads
    };
    
    console.log(`📤 UPLOAD ${url}`, {
      fileCount: formData.getAll('files')?.length || formData.getAll('file')?.length || 0,
      fileNames: formData.getAll('files')?.map(f => f.name) || formData.getAll('file')?.map(f => f.name) || []
    });
    
    return api.post(url, formData, uploadConfig);
  },

  // Upload single file
  uploadSingle: (file, category = 'property', onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    return apiService.upload('/upload', formData, onProgress);
  },

  // Upload multiple files
  uploadMultiple: (files, category = 'property', onProgress = null) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('category', category);
    
    return apiService.upload('/upload/multiple', formData, onProgress);
  },

  // Cancel token source for request cancellation
  createCancelToken: () => axios.CancelToken.source(),

  // Check if error is a cancellation
  isCancel: (error) => axios.isCancel(error),

  // Test connection to backend
  testConnection: () => api.get('/health'),

  // Get current user info from backend
  getCurrentUser: () => api.get('/auth/me'),
};

// UPLOAD API
export const uploadAPI = {
  // Upload single file
  uploadFile: (file, category = 'property', description = '', tags = []) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (description) formData.append('description', description);
    if (tags.length > 0) formData.append('tags', tags.join(','));

    console.log(`📤 Uploading single file: ${file.name}`, { category, description });
    return apiService.upload('/upload', formData);
  },

  // Upload multiple files
  uploadMultipleFiles: (files, category = 'property', description = '', tags = [], onProgress = null) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('category', category);
    if (description) formData.append('description', description);
    if (tags.length > 0) formData.append('tags', tags.join(','));

    console.log(`📤 Uploading ${files.length} files`, { 
      category, 
      fileNames: files.map(f => f.name) 
    });
    return apiService.upload('/upload/multiple', formData, onProgress);
  },

  // Get all uploads with optional filters
  getUploads: (params = {}) => {
    const {
      page = 1,
      limit = 20,
      category,
      search
    } = params;

    console.log('🔍 Fetching uploads with params:', params);
    return apiService.get('/upload', {
      params: {
        page,
        limit,
        category,
        search
      }
    });
  },

  // Get single upload by ID
  getUpload: (id) => {
    console.log(`🔍 Fetching upload: ${id}`);
    return apiService.get(`/upload/${id}`);
  },

  // Update upload details
  updateUpload: (id, updates) => {
    console.log(`✏️ Updating upload ${id}:`, updates);
    return apiService.put(`/upload/${id}`, updates);
  },

  // Delete upload
  deleteUpload: (id) => {
    console.log(`🗑️ Deleting upload: ${id}`);
    return apiService.delete(`/upload/${id}`);
  },

  // Upload with progress tracking
  uploadWithProgress: (files, category = 'property', onProgress) => {
    return uploadAPI.uploadMultipleFiles(files, category, '', [], onProgress);
  }
};

// Properties API with enhanced methods
export const propertiesAPI = {
  // Get all properties with optional filters
  getProperties: (filters = {}) => {
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
      sort
    } = filters;

    console.log('🔍 Fetching properties with filters:', filters);
    
    return apiService.get('/properties', {
      params: {
        page,
        limit,
        type,
        status,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        city,
        featured,
        search,
        sort
      }
    });
  },

  // Get single property
  getProperty: (id) => {
    console.log(`🔍 Fetching property: ${id}`);
    return apiService.get(`/properties/${id}`);
  },

  // Get featured properties
  getFeaturedProperties: () => 
    apiService.get('/properties/featured'),

  // Get properties by agent
  getPropertiesByAgent: (agentId) => 
    apiService.get(`/properties/agent/${agentId}`),

  // Get my properties (admin only)
  getMyProperties: () => {
    console.log('🔍 Fetching my properties');
    return apiService.get('/properties/my/properties');
  },

  // Create property (admin only) with enhanced debugging
  createProperty: (propertyData) => {
    console.log('🏠 Creating property with data:', JSON.stringify(propertyData, null, 2));
    return apiService.post('/properties', propertyData);
  },

  // Update property (admin only)
  updateProperty: (id, updates) => {
    console.log(`✏️ Updating property ${id}:`, updates);
    return apiService.put(`/properties/${id}`, updates);
  },

  // Delete property (admin only)
  deleteProperty: (id) => {
    console.log(`🗑️ Deleting property: ${id}`);
    return apiService.delete(`/properties/${id}`);
  },

  // Upload property images
  uploadImages: (files, onProgress = null) => {
    console.log(`🖼️ Uploading ${files.length} property images...`);
    return uploadAPI.uploadMultipleFiles(files, 'property', '', [], onProgress);
  },

  // Update property images
  updatePropertyImages: (propertyId, imageIds, featuredImageId) => {
    console.log(`🖼️ Updating property ${propertyId} images:`, { imageIds, featuredImageId });
    return apiService.put(`/properties/${propertyId}/images`, {
      imageIds,
      featuredImageId
    });
  },

  // Test property creation with different structures
  testCreateProperty: async (testData) => {
    console.log('🧪 Testing property creation with:', testData);
    try {
      const result = await apiService.post('/properties', testData);
      console.log('✅ Test successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  },

  // Get property schema/validation rules (if available)
  getPropertySchema: () => apiService.get('/properties/schema'),
};

// Blog API
export const blogAPI = {
  // Get all blog posts with optional filters
  getPosts: (filters = {}) => {
    const {
      page = 1,
      limit = 9,
      category,
      status = 'published',
      search,
      tag
    } = filters;

    return apiService.get('/blog', {
      params: {
        page,
        limit,
        category,
        status,
        search,
        tag
      }
    });
  },

  // Get single blog post by ID or slug
  getPost: (idOrSlug) => 
    apiService.get(`/blog/${idOrSlug}`),

  // Get related posts
  getRelatedPosts: (postId) => 
    apiService.get(`/blog/${postId}/related`),

  // Create blog post (admin only)
  createPost: (postData) => 
    apiService.post('/blog', postData),

  // Update blog post (admin only)
  updatePost: (id, updates) => 
    apiService.put(`/blog/${id}`, updates),

  // Delete blog post (admin only)
  deletePost: (id) => 
    apiService.delete(`/blog/${id}`),

  // Upload blog images
  uploadImages: (files, onProgress = null) => {
    console.log(`📷 Uploading ${files.length} blog images...`);
    return uploadAPI.uploadMultipleFiles(files, 'blog', '', [], onProgress);
  },

  // Add comment to blog post
  addComment: (postId, content) => 
    apiService.post(`/blog/${postId}/comments`, { content }),

  // Like/unlike blog post
  toggleLike: (postId) => 
    apiService.post(`/blog/${postId}/like`),

  // Get posts by category
  getPostsByCategory: (category) => 
    apiService.get('/blog', { params: { category, status: 'published' } }),

  // Get posts by tag
  getPostsByTag: (tag) => 
    apiService.get('/blog', { params: { tag, status: 'published' } }),
};

// Admin API (for admin dashboard)
export const adminAPI = {
  // Get dashboard stats
  getStats: () => 
    apiService.get('/admin/stats'),

  // Get recent activity
  getRecentActivity: () => 
    apiService.get('/admin/activity'),

  // Get system health
  getSystemHealth: () => 
    apiService.get('/admin/health'),

  // Get users list
  getUsers: () => 
    apiService.get('/admin/users'),

  // Get media library (uploads)
  getMediaLibrary: (params = {}) => 
    uploadAPI.getUploads(params),
};

// Debug utilities
export const debugAPI = {
  // Test backend connection
  testBackend: () => apiService.testConnection(),

  // Test authentication
  testAuth: () => apiService.getCurrentUser(),

  // Test property creation with minimal data
  testMinimalProperty: () => propertiesAPI.testCreateProperty({
    title: "Test Property",
    description: "Test description",
    price: 100000,
    type: "house",
    status: "for-sale",
    location: {
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      zipCode: "12345"
    },
    specifications: {
      bedrooms: 2,
      bathrooms: 1,
      area: 1000
    },
    amenities: [],
    images: [],
    createdBy: "test-user",
    agentId: "test-user"
  }),

  // Test file upload
  testFileUpload: (file) => {
    console.log('🧪 Testing file upload:', file.name);
    return uploadAPI.uploadFile(file, 'test');
  },

  // Get all available endpoints
  getEndpoints: () => apiService.get('/')
};

// Export the main apiService as default
export default apiService;