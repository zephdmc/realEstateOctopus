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
// First, check if dotenv is installed and import it safely
let dotenv;
try {
  dotenv = (await import('dotenv')).default;
  dotenv.config();
  console.log('✅ dotenv configured successfully');
} catch (error) {
  console.log('⚠️ dotenv not available, using environment variables directly');
}

import app from './src/app.js';
import { logInfo, logError } from './src/utils/logger.js';

const startServer = async () => {
  try {
    logInfo("🚀 SERVER.JS STARTING - VERSION 3");

    // Check for required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'MONGODB_URL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logError(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      logInfo('Available environment variables:', Object.keys(process.env));
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;
    logInfo(`🔗 MongoDB URI: ${MONGODB_URI ? 'Found' : 'Missing'}`);

    let dbConnection;

    // Try to import and use mongoose directly
    try {
      const mongoose = await import('mongoose');
      
      logInfo('🔗 Connecting to MongoDB via mongoose...');
      
      // Mongoose connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(MONGODB_URI, options);
      dbConnection = mongoose.connection;

      // Wait for connection to be established
      await new Promise((resolve, reject) => {
        dbConnection.once('open', resolve);
        dbConnection.on('error', reject);
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 10000);
      });

    } catch (dbError) {
      logError('❌ MongoDB connection failed:', dbError);
      throw dbError;
    }

    // Verify database connection
    if (dbConnection.readyState === 1) {
      logInfo('✅ MongoDB connected successfully');
    } else {
      logError(`❌ MongoDB connection failed. Current state: ${dbConnection.readyState}`);
      throw new Error(`Database connection not established. State: ${dbConnection.readyState}`);
    }

    // Set database connection in app instance if the property exists
    if (app.dbConnection !== undefined) {
      app.dbConnection = dbConnection;
    }

    // Set database health status (if method exists)
    const dbHealth = dbConnection.readyState === 1 ? 'connected' : 'disconnected';
    if (typeof app.setDatabaseHealth === 'function') {
      app.setDatabaseHealth(dbHealth);
    }

    // Start the Express server
    const server = app.start();
    
    // Set server instance if the property exists
    if (app.server !== undefined) {
      app.server = server;
    }

    logInfo('✅ Application started successfully');

    // Graceful shutdown handlers
    setupGracefulShutdown(server, dbConnection);

  } catch (error) {
    logError('❌ Failed to start application:', error);
    process.exit(1);
  }
};

const setupGracefulShutdown = (server, dbConnection) => {
  const shutdown = async (signal) => {
    logInfo(`📭 ${signal} received, shutting down gracefully...`);
    
    let shutdownTimeout;
    
    // Close HTTP server
    server.close((err) => {
      if (err) {
        logError('❌ Error closing HTTP server:', err);
      } else {
        logInfo('✅ HTTP server closed');
      }
    });

    // Close database connection
    if (dbConnection && dbConnection.readyState === 1) {
      try {
        await dbConnection.close();
        logInfo('✅ Database connection closed');
      } catch (dbError) {
        logError('❌ Error closing database connection:', dbError);
      }
    }

    // Exit process with timeout
    shutdownTimeout = setTimeout(() => {
      logInfo('⏰ Shutdown timeout, forcing exit');
      process.exit(1);
    }, 10000);

    // Clear timeout and exit normally if everything closes in time
    clearTimeout(shutdownTimeout);
    logInfo('👋 Process terminated gracefully');
    process.exit(0);
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
};

// Start the server
startServer();

// Export for testing
export { app, startServer };