// Application configuration
const appConfig = {
    // Basic app information
    app: {
      name: process.env.APP_NAME || 'EliteProperties API',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT) || 5000,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    },
  
    // Security configuration
    security: {
      // JWT configuration
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE || '30d',
        issuer: process.env.APP_NAME || 'EliteProperties API',
        audience: process.env.FRONTEND_URL || 'http://localhost:3000'
      },
  
      // CORS configuration
      cors: {
        enabled: true,
        origins: [
          process.env.FRONTEND_URL,
          'http://localhost:3000',
          'http://localhost:5173'
        ]
      },
  
      // Rate limiting configuration
      rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      },
  
      // Helmet configuration for security headers
      helmet: {
        enabled: true,
        options: {
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https:"],
            },
          },
          crossOriginEmbedderPolicy: false
        }
      }
    },
  
    // Logging configuration
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.NODE_ENV === 'production' ? 'json' : 'simple',
      file: {
        enabled: true,
        maxSize: '10m',
        maxFiles: '5'
      },
      console: {
        enabled: process.env.NODE_ENV !== 'production'
      }
    },
  
    // Cache configuration
    cache: {
      // Redis configuration (if using Redis)
      redis: {
        enabled: process.env.REDIS_ENABLED === 'true',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        ttl: 3600 // 1 hour in seconds
      },
  
      // In-memory cache configuration
      memory: {
        enabled: true,
        ttl: 300, // 5 minutes in seconds
        max: 100 // maximum number of items in cache
      }
    },
  
    // Upload configuration
    upload: {
      // Maximum file size
      maxFileSize: 10 * 1024 * 1024, // 10MB
      
      // Allowed file types
      allowedFileTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png', 
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
      
      // Upload directory
      directory: 'uploads',
      
      // Temporary directory for processing
      tempDirectory: 'temp'
    },
  
    // API configuration
    api: {
      // API version
      version: 'v1',
      
      // API prefix
      prefix: '/api',
      
      // API documentation
      docs: {
        enabled: process.env.NODE_ENV !== 'production',
        path: '/api-docs'
      },
      
      // Response compression
      compression: {
        enabled: true,
        threshold: 1024
      }
    },
  
    // Monitoring and health checks
    monitoring: {
      // Health check endpoints
      health: {
        enabled: true,
        path: '/health'
      },
      
      // Metrics endpoint (for Prometheus, etc.)
      metrics: {
        enabled: process.env.METRICS_ENABLED === 'true',
        path: '/metrics'
      }
    },
  
    // Feature flags
    features: {
      // Enable/disable specific features
      emailNotifications: process.env.EMAIL_NOTIFICATIONS !== 'false',
      fileUpload: process.env.FILE_UPLOAD !== 'false',
      googleSheets: process.env.GOOGLE_SHEETS !== 'false',
      cloudinary: process.env.CLOUDINARY_ENABLED !== 'false',
      strapiIntegration: process.env.STRAPI_INTEGRATION !== 'false'
    }
  };
  
  export default appConfig;