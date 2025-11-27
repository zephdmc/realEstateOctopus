import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import configurations
import appConfig from './config/app.js';

// Import CORS configuration
import { configureCors } from './config/corsOptions.js';

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
    console.log('🚀 Initializing Middlewares...');

    // ⭐ USE ONLY OFFICIAL CORS (NO MANUAL CORS)
    configureCors(this.app);

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
    this.app.use(express.json({ limit: appConfig.upload.maxFileSize }));
    this.app.use(express.urlencoded({ extended: true, limit: appConfig.upload.maxFileSize }));

    // Cookie parser
    this.app.use(cookieParser());

    // Logging middleware
    this.initializeLogging();

    // Sanitization middleware
    this.app.use(sanitizeInput);

    // Static files serving
    this.app.use('/uploads', express.static(appConfig.upload.directory));
    this.app.use('/public', express.static('public'));

    // Test CORS endpoints
    this.app.get('/test-cors', (req, res) => {
      res.json({
        success: true,
        message: 'CORS is working! 🎉',
        yourOrigin: req.headers.origin,
        timestamp: new Date().toISOString(),
        environment: this.environment
      });
    });

    this.app.get('/api/test-cors', (req, res) => {
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
    this.app.use(generalLimiter);
    this.app.use('/api/auth', authLimiter);
    this.app.use('/api/contact', contactLimiter);
  }

  // Initialize logging based on environment
  initializeLogging() {
    this.app.use(requestLogger);

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
    this.app.use(appConfig.api.prefix, apiRoutes);

    if (appConfig.api.docs.enabled) {
      this.app.get(appConfig.api.docs.path, this.apiDocumentation);
    }

    this.app.use(notFound);
  }

  // Initialize error handling
  initializeErrorHandling() {
    this.app.use(errorHandler);
    this.initializeProcessHandlers();
  }

  // Process event handlers
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
      database: this.dbHealth || 'unknown',
      cors: {
        yourOrigin: req.headers.origin
      }
    };

    res.status(200).json(health);
  }

  // API documentation endpoint
  apiDocumentation = (req, res) => {
    res.status(200).json({
      name: appConfig.app.name,
      version: appConfig.app.version,
      environment: this.environment,
      endpoints: {}
    });
  }

  // Set database health
  setDatabaseHealth(status) {
    this.dbHealth = status;
  }

  // Graceful shutdown
  async shutdown() {
    console.log('🛑 Starting graceful shutdown...');
    if (this.server) this.server.close();
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
      `);
    });

    return this.server;
  }

  getApp() {
    return this.app;
  }
}

// Create and export app instance
const app = new App();
export default app;
