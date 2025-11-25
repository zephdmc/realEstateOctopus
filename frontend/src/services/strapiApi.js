import { apiService } from './api';

class StrapiApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_STRAPI_URL || 'https://cms.estatepro.com';
    this.apiToken = process.env.REACT_APP_STRAPI_API_TOKEN;
  }

  // Generic request method with Strapi headers
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        ...options.headers,
      },
    };

    return apiService.get(`${this.baseUrl}${endpoint}`, config);
  }

  // Properties API
  properties = {
    // Get properties with filters, sorting, and pagination
    find: async (query = {}) => {
      const {
        page = 1,
        pageSize = 12,
        filters = {},
        sort = 'createdAt:desc',
        populate = '*',
        ...rest
      } = query;

      const params = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        sort,
        populate,
        ...rest,
      };

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[`filters[${key}]`] = value;
        }
      });

      return this.request('/api/properties', { params });
    },

    // Get single property by ID or slug
    findOne: async (id, query = {}) => {
      const { populate = '*' } = query;
      const params = { populate };
      
      return this.request(`/api/properties/${id}`, { params });
    },

    // Create new property
    create: async (data) => {
      return apiService.post(`${this.baseUrl}/api/properties`, { data });
    },

    // Update property
    update: async (id, data) => {
      return apiService.put(`${this.baseUrl}/api/properties/${id}`, { data });
    },

    // Delete property
    delete: async (id) => {
      return apiService.delete(`${this.baseUrl}/api/properties/${id}`);
    },

    // Search properties
    search: async (query, filters = {}) => {
      const params = {
        'filters[$or][0][title][$containsi]': query,
        'filters[$or][1][description][$containsi]': query,
        'filters[$or][2][location][address][$containsi]': query,
        ...filters,
      };

      return this.request('/api/properties', { params });
    },
  };

  // Blog Posts API
  blogPosts = {
    // Get blog posts with filters and pagination
    find: async (query = {}) => {
      const {
        page = 1,
        pageSize = 9,
        filters = {},
        sort = 'publishedAt:desc',
        populate = '*',
        ...rest
      } = query;

      const params = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        sort,
        populate,
        ...rest,
      };

      // Add status filter (only published by default)
      if (!filters.status) {
        params['filters[status][$eq]'] = 'published';
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[`filters[${key}]`] = value;
        }
      });

      return this.request('/api/blog-posts', { params });
    },

    // Get single blog post by ID or slug
    findOne: async (id, query = {}) => {
      const { populate = '*' } = query;
      const params = { populate };
      
      return this.request(`/api/blog-posts/${id}`, { params });
    },

    // Get related posts
    findRelated: async (postId, limit = 3) => {
      const params = {
        'filters[id][$ne]': postId,
        'pagination[limit]': limit,
        populate: '*',
        sort: 'publishedAt:desc',
      };

      return this.request('/api/blog-posts', { params });
    },

    // Create new blog post
    create: async (data) => {
      return apiService.post(`${this.baseUrl}/api/blog-posts`, { data });
    },

    // Update blog post
    update: async (id, data) => {
      return apiService.put(`${this.baseUrl}/api/blog-posts/${id}`, { data });
    },
  };

  // Categories API
  categories = {
    find: async (query = {}) => {
      const { populate = '*' } = query;
      const params = { populate };
      
      return this.request('/api/categories', { params });
    },

    findOne: async (id, query = {}) => {
      const { populate = '*' } = query;
      const params = { populate };
      
      return this.request(`/api/categories/${id}`, { params });
    },
  };

  // Tags API
  tags = {
    find: async (query = {}) => {
      const { populate = '*' } = query;
      const params = { populate };
      
      return this.request('/api/tags', { params });
    },
  };

  // Media API
  media = {
    upload: async (file, onProgress = null) => {
      const formData = new FormData();
      formData.append('files', file);

      return apiService.upload(
        `${this.baseUrl}/api/upload`,
        formData,
        onProgress,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
          },
        }
      );
    },

    uploadMultiple: async (files, onProgress = null) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      return apiService.upload(
        `${this.baseUrl}/api/upload`,
        formData,
        onProgress,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
          },
        }
      );
    },

    delete: async (id) => {
      return apiService.delete(`${this.baseUrl}/api/upload/files/${id}`);
    },
  };

  // Contact Form Submissions
  contact = {
    submit: async (data) => {
      return apiService.post(`${this.baseUrl}/api/contact-submissions`, { data });
    },
  };

  // Global Settings
  settings = {
    get: async () => {
      return this.request('/api/global', {
        params: { populate: '*' },
      });
    },
  };
}

export const strapiApi = new StrapiApiService();
export default strapiApi;