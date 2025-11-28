// import dotenv from 'dotenv';
// import app from './src/app.js';
// import databaseConfig from './src/config/database.js';
// import { logInfo, logError } from './src/utils/logger.js';

// // Load environment variables FIRST
// dotenv.config();

// const startServer = async () => {
//   try {
//     console.log("🚀 SERVER.JS STARTING - VERSION 2");

//     // Connect to database
// <<<<<<< HEAD
//     const dbConnection = await connectDatabase();

//     // ✅ Explicitly log successful connection
// =======
//     const dbConnection = await databaseConfig.connect(); // connect() returns mongoose.connection

//     // ✅ Log successful connection
// >>>>>>> 9f5f737b1d4d98c117532d699b6841eda4a07b7b
//     if (dbConnection.readyState === 1) {
//       logInfo('✅ MongoDB connected successfully');
//     } else {
//       logError('❌ MongoDB connection not established, current state:', dbConnection.readyState);
// <<<<<<< HEAD
// =======
//       process.exit(1);
// >>>>>>> 9f5f737b1d4d98c117532d699b6841eda4a07b7b
//     }

//     // Set database connection in app instance
//     app.dbConnection = dbConnection;

//     // Check database health (simple check)
//     const dbHealth = dbConnection.readyState === 1 ? 'connected' : 'disconnected';
//     app.setDatabaseHealth(dbHealth);

//     // Start the Express server
//     const server = app.start();
//     app.server = server;

//     logInfo('✅ Application started successfully');

//   } catch (error) {
//     logError('❌ Failed to start application:', error);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

// // Export for testing
// export { app };import dotenv from 'dotenv';
// Simple environment check without dotenv dependency
import app from './src/app.js';
import { logInfo, logError } from './src/utils/logger.js';

const startServer = async () => {
  try {
    logInfo("🚀 SERVER.JS STARTING - PRODUCTION VERSION");

    // Debug: Log all MongoDB-related environment variables
    const mongoVars = {
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_URL: process.env.MONGODB_URL,
      MONGODB_URI1: process.env.MONGODB_URI1
    };
    
    logInfo('🔍 MongoDB Environment Variables:', mongoVars);

    // Use MONGODB_URI (which exists in your environment)
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGODB_URI1;
    
    if (!MONGODB_URI) {
      throw new Error('No MongoDB URI found in environment variables. Available MongoDB vars: ' + JSON.stringify(mongoVars));
    }

    logInfo('🔗 Connecting to MongoDB...');

    // Direct mongoose connection
    const mongoose = await import('mongoose');
    
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    const dbConnection = mongoose.connection;
    
    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MongoDB connection timeout (10s)'));
      }, 10000);

      dbConnection.once('open', () => {
        clearTimeout(timeout);
        resolve();
      });

      dbConnection.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    if (dbConnection.readyState === 1) {
      logInfo('✅ MongoDB connected successfully');
    } else {
      throw new Error(`MongoDB connection failed. Connection state: ${dbConnection.readyState}`);
    }

    // Set database connection in app instance if the property exists
    if (app.dbConnection !== undefined) {
      app.dbConnection = dbConnection;
    }

    // Set database health status (if method exists)
    if (typeof app.setDatabaseHealth === 'function') {
      app.setDatabaseHealth('connected');
    }

    // Start the Express server
    const server = app.start();
    
    // Set server instance if the property exists
    if (app.server !== undefined) {
      app.server = server;
    }

    logInfo(`✅ Application started successfully on port ${process.env.PORT || 3000}`);

    // Graceful shutdown
    const shutdown = async (signal) => {
      logInfo(`📭 ${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        logInfo('✅ HTTP server closed');
      });

      if (dbConnection && dbConnection.readyState === 1) {
        try {
          await mongoose.disconnect();
          logInfo('✅ MongoDB disconnected');
        } catch (error) {
          logError('❌ Error disconnecting MongoDB:', error);
        }
      }

      setTimeout(() => {
        logInfo('👋 Process terminated');
        process.exit(0);
      }, 5000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logError('💥 Uncaught Exception:', error);
      shutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logError('💥 Unhandled Promise Rejection at:', promise, 'reason:', reason);
      shutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    logError('❌ Failed to start application:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing
export { app };