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
    logInfo("🚀 SERVER.JS STARTING - MONGOOSE v7 COMPATIBLE");

    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    logInfo('🔗 Connecting to MongoDB Atlas...');

    try {
      // Import mongoose - modern versions have different API
      const mongoose = await import('mongoose');
      logInfo('✅ Mongoose imported successfully');
      
      // For mongoose v6+, connection events are set up differently
      // Don't set up event listeners on mongoose.connection directly
      
      logInfo('📡 Establishing database connection...');
      
      // Modern mongoose connection - simpler approach
      await mongoose.connect(MONGODB_URI, {
        // These options are the main ones needed for modern mongoose
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      
      logInfo('✅ Mongoose connect() completed successfully');
      
      // Get the connection - in modern mongoose, this should be available after connect
      const dbConnection = mongoose.connection;
      
      if (!dbConnection) {
        throw new Error('Mongoose connection object is not available');
      }
      
      logInfo(`📊 MongoDB connection state: ${dbConnection.readyState} (1=connected)`);

      // Check if we're connected
      if (dbConnection.readyState === 1) {
        logInfo('✅ MongoDB connected successfully');
      } else {
        // Wait a bit and check again
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (dbConnection.readyState === 1) {
          logInfo('✅ MongoDB connected successfully after wait');
        } else {
          throw new Error(`MongoDB connection not established. State: ${dbConnection.readyState}`);
        }
      }

      // Set database connection in app instance if needed
      if (app.dbConnection !== undefined) {
        app.dbConnection = dbConnection;
        logInfo('✅ Database connection set in app instance');
      }

      // Set database health status if method exists
      if (typeof app.setDatabaseHealth === 'function') {
        app.setDatabaseHealth('connected');
        logInfo('✅ Database health status set');
      }

    } catch (dbError) {
      logError('❌ MongoDB connection failed:', dbError);
      throw dbError;
    }

    // Start the Express server
    logInfo('🚀 Starting Express server...');
    const server = app.start();
    
    // Set server instance if needed
    if (app.server !== undefined) {
      app.server = server;
    }

    const port = process.env.PORT || 3000;
    logInfo(`✅ Application started successfully on port ${port}`);
    logInfo(`🌐 MongoDB Database: realestate`);
    logInfo(`🔗 MongoDB Cluster: imoitc`);

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logInfo(`\n📭 ${signal} received, shutting down gracefully...`);
      
      // Close HTTP server
      server.close(() => {
        logInfo('✅ HTTP server closed');
      });

      // Close MongoDB connection
      try {
        const mongoose = await import('mongoose');
        await mongoose.disconnect();
        logInfo('✅ MongoDB connection closed');
      } catch (error) {
        logError('❌ Error closing MongoDB connection:', error);
      }

      logInfo('👋 Process terminated gracefully');
      process.exit(0);
    };

    // Handle process signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logError('💥 Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logError('💥 Unhandled Promise Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    logError('❌ Failed to start application:', error);
    
    // Provide specific MongoDB connection troubleshooting
    if (error.name === 'MongoServerSelectionError') {
      logError('🔧 Troubleshooting: Check if your MongoDB Atlas IP whitelist includes Render.com IP addresses');
      logError('🔧 Troubleshooting: Verify your MongoDB Atlas cluster is running');
    } else if (error.name === 'MongoParseError') {
      logError('🔧 Troubleshooting: Check your MongoDB connection string format');
    }
    
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing
export { app };