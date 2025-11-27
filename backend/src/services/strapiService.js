import axios from 'axios';
import ErrorResponse from '../utils/ErrorResponse.js';

// Create Strapi API client
const strapi = axios.create({
  baseURL: process.env.STRAPI_BASE_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API token if available
if (process.env.STRAPI_API_TOKEN) {
  strapi.defaults.headers.common['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
}

// Strapi Service
export class StrapiService {
  // Get content entries
  static async getEntries(contentType, query = {}) {
    try {
      const response = await strapi.get(`/api/${contentType}`, { params: query });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      throw new ErrorResponse(`Failed to fetch ${contentType}`, 500);
    }
  }

  // Get single entry
  static async getEntry(contentType, id, query = {}) {
    try {
      const response = await strapi.get(`/api/${contentType}/${id}`, { params: query });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${contentType} ${id}:`, error);
      throw new ErrorResponse(`${contentType} not found`, 404);
    }
  }

  // Create entry
  static async createEntry(contentType, data) {
    try {
      const response = await strapi.post(`/api/${contentType}`, { data });
      return response.data;
    } catch (error) {
      console.error(`Error creating ${contentType}:`, error);
      throw new ErrorResponse(`Failed to create ${contentType}`, 500);
    }
  }

  // Update entry
  static async updateEntry(contentType, id, data) {
    try {
      const response = await strapi.put(`/api/${contentType}/${id}`, { data });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${contentType} ${id}:`, error);
      throw new ErrorResponse(`Failed to update ${contentType}`, 500);
    }
  }

  // Delete entry
  static async deleteEntry(contentType, id) {
    try {
      const response = await strapi.delete(`/api/${contentType}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${contentType} ${id}:`, error);
      throw new ErrorResponse(`Failed to delete ${contentType}`, 500);
    }
  }

  // Upload media
  static async uploadMedia(file, folder = 'real-estate') {
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', folder);

      const response = await strapi.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading media to Strapi:', error);
      throw new ErrorResponse('Failed to upload media', 500);
    }
  }

  // Get site settings
  static async getSiteSettings() {
    try {
      const response = await strapi.get('/api/site-setting');
      return response.data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      throw new ErrorResponse('Failed to fetch site settings', 500);
    }
  }

  // Get navigation
  static async getNavigation() {
    try {
      const response = await strapi.get('/api/navigation/render/main-navigation');
      return response.data;
    } catch (error) {
      console.error('Error fetching navigation:', error);
      throw new ErrorResponse('Failed to fetch navigation', 500);
    }
  }
}

export default StrapiService;