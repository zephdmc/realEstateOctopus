import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import configurations
import appConfig from './config/app.js';
import { configureCors, emergencyCors, testCors } from './middleware/cors.js';

// Import middleware
import { 
  generalLimiter, 
  authLimiter, 
  contactLimiter 
} from './middleware/rateLimit.js';
import { requestLogger } from './utils/logger.js';
import { sanitizeInput } from './middleware/validation.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import apiRoutes from './routes/index.js';

class App {
  constructor() {
    this.app = express();
    this.port = appConfig.app.port;
    this.environment = appConfig.app.environment;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // Initialize all middlewares
  initializeMiddlewares() {
    // 🚨 TEMPORARY: Use emergency CORS to fix the issue immediately
    console.log('🚨 Applying emergency CORS configuration for GitHub Pages');
    emergencyCors(this.app);

    // Security middleware - configure helmet to be CORS compatible
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      // Temporarily disable some helmet features for CORS compatibility
      contentSecurityPolicy: false
    }));

    // Compression middleware
    if (appConfig.api.compression.enabled) {
      this.app.use(compression({
        threshold: appConfig.api.compression.threshold
      }));
    }

    // Rate limiting
    if (appConfig.security.rateLimit.enabled) {
      this.applyRateLimiting();
    }

    // Body parsing middleware
    this.app.use(express.json({ 
      limit: appConfig.upload.maxFileSize 
    }));
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: appConfig.upload.maxFileSize 
    }));

    // Cookie parser
    this.app.use(cookieParser());

    // Logging middleware
    this.initializeLogging();

    // Sanitization middleware
    this.app.use(sanitizeInput);

    // Static files serving
    this.app.use('/uploads', express.static(appConfig.upload.directory));
    this.app.use('/public', express.static('public'));

    // Health check endpoint with CORS
    this.app.get('/health', this.healthCheck);
    
    // CORS test endpoint
    this.app.get('/api/test-cors', testCors);
  }

  // Apply rate limiting based on routes
  applyRateLimiting() {
    // General rate limiting for all routes
    this.app.use(generalLimiter);

    // Stricter rate limiting for auth routes
    this.app.use('/api/auth', authLimiter);

    // Rate limiting for contact routes
    this.app.use('/api/contact', contactLimiter);
  }

  // Initialize logging based on environment
  initializeLogging() {
    // Request logging
    this.app.use(requestLogger);

    // HTTP request logging
    if (this.environment === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        skip: (req, res) => res.statusCode < 400 // Only log errors in production
      }));
    }
  }

  // Initialize all routes
  initializeRoutes() {
    // API routes
    this.app.use(appConfig.api.prefix, apiRoutes);

    // API documentation route (if enabled)
    if (appConfig.api.docs.enabled) {
      this.app.get(appConfig.api.docs.path, this.apiDocumentation);
    }

    // Monitoring routes (if enabled)
    if (appConfig.monitoring.metrics.enabled) {
      this.app.get(appConfig.monitoring.metrics.path, this.metricsEndpoint);
    }

    // 404 handler for unmatched routes
    this.app.use(notFound);
  }

  // Initialize error handling
  initializeErrorHandling() {
    // Global error handler
    this.app.use(errorHandler);

    // Process event handlers for uncaught exceptions
    this.initializeProcessHandlers();
  }

  // Initialize process event handlers
  initializeProcessHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
      console.error(error.name, error.message);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...');
      console.error('Promise:', promise);
      console.error('Reason:', reason);
      process.exit(1);
    });

    // Graceful shutdown handler
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      console.log('👋 SIGINT RECEIVED. Shutting down gracefully...');
      this.shutdown();
    });
  }

  // Health check endpoint
  healthCheck = (req, res) => {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.environment,
      version: appConfig.app.version,
      memory: process.memoryUsage(),
      database: 'unknown', // Will be updated after database connection
      cors: {
        yourOrigin: req.headers.origin,
        allowedOrigins: [
          'https://zephdmc.github.io',
          'https://zephdmc.github.io/realEstateOctopus',
          'http://localhost:3000',
          'http://localhost:5173',
          'https://eliteproperties.vercel.app'
        ]
      }
    };

    // Add database health if available
    if (this.dbHealth) {
      health.database = this.dbHealth;
    }

    res.status(200).json(health);
  }

  // API documentation endpoint
  apiDocumentation = (req, res) => {
    const docs = {
      name: appConfig.app.name,
      version: appConfig.app.version,
      environment: this.environment,
      endpoints: {
        auth: {
          'POST /api/auth/register': 'Register a new user',
          'POST /api/auth/login': 'Login user',
          'GET /api/auth/me': 'Get current user',
          'PUT /api/auth/updatepassword': 'Update password',
          'POST /api/auth/forgotpassword': 'Forgot password',
          'PUT /api/auth/resetpassword/:token': 'Reset password'
        },
        properties: {
          'GET /api/properties': 'Get all properties',
          'GET /api/properties/:id': 'Get single property',
          'POST /api/properties': 'Create property (protected)',
          'PUT /api/properties/:id': 'Update property (protected)',
          'DELETE /api/properties/:id': 'Delete property (protected)',
          'GET /api/properties/featured': 'Get featured properties'
        },
        blog: {
          'GET /api/blog': 'Get all blog posts',
          'GET /api/blog/:id': 'Get single blog post',
          'POST /api/blog': 'Create blog post (protected)',
          'PUT /api/blog/:id': 'Update blog post (protected)',
          'DELETE /api/blog/:id': 'Delete blog post (protected)',
          'POST /api/blog/:id/comments': 'Add comment (protected)'
        },
        contact: {
          'POST /api/contact': 'Submit contact form',
          'GET /api/contact': 'Get contact messages (admin)',
          'GET /api/contact/:id': 'Get contact message (admin)',
          'PUT /api/contact/:id': 'Update contact message (admin)'
        },
        appointments: {
          'POST /api/appointments': 'Create appointment',
          'GET /api/appointments': 'Get appointments (protected)',
          'GET /api/appointments/:id': 'Get appointment (protected)',
          'PUT /api/appointments/:id': 'Update appointment (protected)',
          'PUT /api/appointments/:id/cancel': 'Cancel appointment (protected)'
        },
        upload: {
          'POST /api/upload': 'Upload file (protected)',
          'POST /api/upload/multiple': 'Upload multiple files (protected)',
          'GET /api/upload': 'Get uploads (protected)',
          'DELETE /api/upload/:id': 'Delete upload (protected)'
        }
      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer <token>'
      },
      cors: {
        note: 'CORS is configured for GitHub Pages and local development',
        allowedOrigins: [
          'https://zephdmc.github.io',
          'https://zephdmc.github.io/realEstateOctopus',
          'http://localhost:3000',
          'http://localhost:5173',
          'https://eliteproperties.vercel.app'
        ]
      }
    };

    res.status(200).json(docs);
  }

  // Metrics endpoint (placeholder for future implementation)
  metricsEndpoint = (req, res) => {
    const metrics = {
      timestamp: new Date().toISOString(),
      process: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      requests: {
        total: 0, // Would be implemented with a metrics collector
        byEndpoint: {}
      }
    };

    res.status(200).json(metrics);
  }

  // Set database health status
  setDatabaseHealth(status) {
    this.dbHealth = status;
  }

  // Graceful shutdown method
  async shutdown() {
    console.log('🛑 Starting graceful shutdown...');

    try {
      // Close database connections
      if (this.dbConnection) {
        await this.dbConnection.close();
        console.log('✅ Database connection closed.');
      }

      // Close server
      if (this.server) {
        this.server.close(() => {
          console.log('✅ HTTP server closed.');
          process.exit(0);
        });

        // Force close after 10 seconds
        setTimeout(() => {
          console.log('⚠️ Forcing shutdown after timeout...');
          process.exit(1);
        }, 10000);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  // Start the application
  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`
🚀 ${appConfig.app.name} v${appConfig.app.version}
📍 Environment: ${this.environment}
📍 Port: ${this.port}
📍 Health: http://localhost:${this.port}/health
📍 CORS Test: http://localhost:${this.port}/api/test-cors
${appConfig.api.docs.enabled ? `📍 API Docs: http://localhost:${this.port}${appConfig.api.docs.path}` : ''}
📍 Allowed Origins: 
   - https://zephdmc.github.io
   - https://zephdmc.github.io/realEstateOctopus
   - http://localhost:3000
   - http://localhost:5173
   - https://eliteproperties.vercel.app
      `);
    });

    return this.server;
  }

  // Get Express app instance (for testing)
  getApp() {
    return this.app;
  }
}

// Create and export app instance
const app = new App();
export default app;
