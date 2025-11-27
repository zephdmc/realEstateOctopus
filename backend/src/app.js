import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import configs
import appConfig from './config/app.js';

// CORS
import { configureCors } from './middleware/cors.js';

// Rate limiters
import { generalLimiter, authLimiter, contactLimiter } from './middleware/rateLimit.js';

// Middleware
import { requestLogger } from './utils/logger.js';
import { sanitizeInput } from './middleware/validation.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import apiRoutes from './routes/index.js';

class App {
  constructor() {
    this.app = express();
    this.environment = appConfig.app.environment;

    // Use dynamic port from environment (Railway / Heroku)
    this.port = process.env.PORT || appConfig.app.port || 5000;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddlewares() {
    console.log("🚀 Initializing Middlewares...");

    // ⭐ 1️⃣ CORS FIRST
    configureCors(this.app);

    // Preflight for all routes
    this.app.options('*', (req, res) => res.sendStatus(204));

    // ⭐ 2️⃣ Security & compression
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
      })
    );

    if (appConfig.api.compression.enabled) {
      this.app.use(compression({ threshold: appConfig.api.compression.threshold }));
    }

    // ⭐ 3️⃣ Rate limiters (skip OPTIONS)
    if (appConfig.security.rateLimit.enabled) {
      this.applyRateLimiting();
    }

    // ⭐ 4️⃣ Body parsing
    this.app.use(express.json({ limit: appConfig.upload.maxFileSize }));
    this.app.use(express.urlencoded({ extended: true, limit: appConfig.upload.maxFileSize }));

    // Cookies
    this.app.use(cookieParser());

    // Logging
    this.initializeLogging();

    // Sanitization
    this.app.use(sanitizeInput);

    // Static files
    this.app.use('/uploads', express.static(appConfig.upload.directory));
    this.app.use('/public', express.static('public'));

    // Debug endpoints
    this.app.get('/test-cors', (req, res) => {
      res.json({
        success: true,
        message: "CORS functional 🎉",
        origin: req.headers.origin,
        timestamp: new Date().toISOString(),
      });
    });

    this.app.get('/api/test-cors', (req, res) => {
      res.json({
        success: true,
        message: "API CORS OK 🎉",
        origin: req.headers.origin,
      });
    });

    // Health check
    this.app.get('/health', this.healthCheck);
  }

  applyRateLimiting() {
    const skipOptions = (req) => req.method === 'OPTIONS';

    this.app.use((req, res, next) => {
      if (skipOptions(req)) return next();
      return generalLimiter(req, res, next);
    });

    this.app.use('/api/auth', (req, res, next) => {
      if (skipOptions(req)) return next();
      return authLimiter(req, res, next);
    });

    this.app.use('/api/contact', (req, res, next) => {
      if (skipOptions(req)) return next();
      return contactLimiter(req, res, next);
    });
  }

  initializeLogging() {
    this.app.use(requestLogger);

    if (this.environment === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(
        morgan('combined', { skip: (req, res) => res.statusCode < 400 })
      );
    }
  }

  initializeRoutes() {
    this.app.use(appConfig.api.prefix, apiRoutes);

    if (appConfig.api.docs.enabled) {
      this.app.get(appConfig.api.docs.path, this.apiDocumentation);
    }

    this.app.use(notFound);
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
    this.initializeProcessHandlers();
  }

  initializeProcessHandlers() {
    const shutdown = () => {
      console.log("⚡ Shutting down gracefully...");
      if (this.server) this.server.close(() => process.exit(0));
    };

    process.on("uncaughtException", (err) => {
      console.error("💥 UNCAUGHT EXCEPTION:", err);
      shutdown();
    });

    process.on("unhandledRejection", (reason) => {
      console.error("💥 UNHANDLED REJECTION:", reason);
      shutdown();
    });

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }

  healthCheck = (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.environment,
      corsOrigin: req.headers.origin,
    });
  };

  apiDocumentation = (req, res) => {
    res.status(200).json({
      name: appConfig.app.name,
      version: appConfig.app.version,
      environment: this.environment,
    });
  };

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 ${appConfig.app.name} running!`);
      console.log(`🌍 ENV: ${this.environment}`);
      console.log(`🔌 PORT: ${this.port}`);
      console.log(`🩺 Health: /health`);
      console.log(`🛂 CORS Test: /test-cors`);
      console.log(`📡 API Test: /api/test-cors`);
    });

    return this.server;
  }

  getApp() {
    return this.app;
  }
}

const appInstance = new App();
export default appInstance;
