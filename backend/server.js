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
import app from './src/app.js';
import databaseConfig from './src/config/database.js';
import { logInfo, logError } from './src/utils/logger.js';

// Load environment variables FIRST
dotenv.config();

const startServer = async () => {
  try {
    logInfo("🚀 SERVER.JS STARTING - VERSION 2");

    let dbConnection;

    // Handle different database config exports
    if (typeof databaseConfig.connect === 'function') {
      // If connect method exists
      dbConnection = await databaseConfig.connect();
    } else if (typeof databaseConfig === 'function') {
      // If the default export is a connect function
      dbConnection = await databaseConfig();
    } else if (databaseConfig.default && typeof databaseConfig.default === 'function') {
      // If using default export with connect function
      dbConnection = await databaseConfig.default();
    } else {
      // Fallback: try to use mongoose directly
      const mongoose = await import('mongoose');
      const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;
      
      if (!MONGODB_URI) {
        throw new Error('MongoDB connection URI not found in environment variables');
      }

      logInfo('🔗 Connecting to MongoDB via direct mongoose connection...');
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      dbConnection = mongoose.connection;
    }

    // Verify database connection
    if (dbConnection.readyState === 1) {
      logInfo('✅ MongoDB connected successfully');
    } else {
      // Wait a bit for connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (dbConnection.readyState === 1) {
        logInfo('✅ MongoDB connected successfully after wait');
      } else {
        logError(`❌ MongoDB connection failed. Current state: ${dbConnection.readyState}`);
        throw new Error(`Database connection not established. State: ${dbConnection.readyState}`);
      }
    }

    // Set database connection in app instance
    app.dbConnection = dbConnection;

    // Set database health status (if method exists)
    const dbHealth = dbConnection.readyState === 1 ? 'connected' : 'disconnected';
    if (typeof app.setDatabaseHealth === 'function') {
      app.setDatabaseHealth(dbHealth);
    }

    // Start the Express server
    const server = app.start();
    app.server = server;

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
    
    // Close HTTP server
    server.close(() => {
      logInfo('✅ HTTP server closed');
    });

    // Close database connection
    if (dbConnection && typeof dbConnection.close === 'function') {
      try {
        await dbConnection.close();
        logInfo('✅ Database connection closed');
      } catch (dbError) {
        logError('❌ Error closing database connection:', dbError);
      }
    } else if (dbConnection && dbConnection.readyState === 1) {
      // For mongoose connections
      try {
        await dbConnection.close();
        logInfo('✅ Database connection closed');
      } catch (dbError) {
        logError('❌ Error closing database connection:', dbError);
      }
    }

    // Exit process
    setTimeout(() => {
      logInfo('👋 Process terminated');
      process.exit(0);
    }, 1000);
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