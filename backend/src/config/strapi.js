// Strapi CMS configuration
const strapiConfig = {
    // API configuration
    api: {
      baseURL: process.env.STRAPI_BASE_URL || 'http://localhost:1337',
      timeout: 30000,
      
      // API token for authenticated requests
      token: process.env.STRAPI_API_TOKEN,
      
      // Default headers
      headers: {
        'Content-Type': 'application/json'
      }
    },
  
    // Content types configuration
    contentTypes: {
      // Property content type
      property: {
        endpoint: '/api/properties',
        populate: [
          'images',
          'agent',
          'amenities'
        ]
      },
  
      // Blog content type
      blog: {
        endpoint: '/api/blogs',
        populate: [
          'featuredImage',
          'author',
          'categories'
        ]
      },
  
      // Contact content type
      contact: {
        endpoint: '/api/contacts'
      },
  
      // Global content types
      global: {
        siteSettings: '/api/site-setting',
        navigation: '/api/navigation/render/main-navigation'
      }
    },
  
    // Media upload configuration
    media: {
      // Maximum file size (in bytes)
      maxFileSize: 10 * 1024 * 1024, // 10MB
      
      // Allowed file types
      allowedFileTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf'
      ],
      
      // Upload folder
      folder: 'real-estate'
    },
  
    // Webhook configuration
    webhooks: {
      // Webhook secret for verification
      secret: process.env.STRAPI_WEBHOOK_SECRET,
      
      // Webhook endpoints to register
      endpoints: [
        {
          event: 'entry.create',
          url: '/api/webhooks/strapi/content-created'
        },
        {
          event: 'entry.update',
          url: '/api/webhooks/strapi/content-updated'
        },
        {
          event: 'entry.delete',
          url: '/api/webhooks/strapi/content-deleted'
        }
      ]
    },
  
    // Cache configuration for Strapi data
    cache: {
      // Cache duration in seconds
      duration: 300, // 5 minutes
      
      // Keys for cached data
      keys: {
        siteSettings: 'strapi:site-settings',
        navigation: 'strapi:navigation',
        properties: 'strapi:properties',
        blogs: 'strapi:blogs'
      }
    }
  };
  
  export default strapiConfig;