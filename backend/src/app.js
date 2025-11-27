import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import configurations
import appConfig from './config/app.js';

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
    console.log('🚀 Initializing CORS middleware (NUCLEAR OPTION)...');

    // 🚨 NUCLEAR OPTION: MANUAL CORS FOR EVERYTHING
    // This middleware will handle ALL requests including preflight
    this.app.use((req, res, next) => {
      const origin = req.headers.origin;
      
      // Define allowed origins
      const allowedOrigins = [
        'https://zephdmc.github.io',
        'https://zephdmc.github.io/realEstateOctopus',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://eliteproperties.vercel.app'
      ];

      console.log(`🌐 CORS Request: ${req.method} ${req.path} from origin: ${origin}`);

      // Set CORS headers for ALL responses
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, X-CSRF-Token');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        console.log('🛬 Preflight request handled successfully');
        return res.status(200).end();
      }

      next();
    });

    // Security middleware - minimal configuration
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false
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

    // Test endpoints
    this.app.get('/test-cors', (req, res) => {
      console.log('✅ CORS Test endpoint hit from:', req.headers.origin);
      res.json({
        success: true,
        message: 'CORS is working! 🎉',
        yourOrigin: req.headers.origin,
        timestamp: new Date().toISOString(),
        environment: this.environment
      });
    });

    this.app.get('/api/test-cors', (req, res) => {
      console.log('✅ API CORS Test endpoint hit from:', req.headers.origin);
      res.json({
        success: true,
        message: 'API CORS is working! 🎉',
        yourOrigin: req.headers.origin,
        timestamp: new Date().toISOString(),
        environment: this.environment
      });
    });

    // Health check endpoint
    this.app.get('/health', this.healthCheck);
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
        skip: (req, res) => res.statusCode < 400
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
    process.on('uncaughtException', (error) => {
      console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
      console.error(error.name, error.message);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...');
      console.error('Promise:', promise);
      console.error('Reason:', reason);
      process.exit(1);
    });

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
      database: 'unknown',
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
        // ... your existing endpoints
      }
    };
    res.status(200).json(docs);
  }

  // Set database health status
  setDatabaseHealth(status) {
    this.dbHealth = status;
  }

  // Graceful shutdown method
  async shutdown() {
    console.log('🛑 Starting graceful shutdown...');
    // ... your existing shutdown code
  }

  // Start the application
  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`
🚀 ${appConfig.app.name} v${appConfig.app.version}
📍 Environment: ${this.environment}
📍 Port: ${this.port}
📍 Health: http://localhost:${this.port}/health
📍 CORS Test: http://localhost:${this.port}/test-cors
📍 API CORS Test: http://localhost:${this.port}/api/test-cors
📍 Allowed Origins: GitHub Pages, Localhost, Vercel
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
