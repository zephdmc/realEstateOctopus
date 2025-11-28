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
    logInfo("🚀 SERVER.JS STARTING - PRODUCTION READY");

    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    logInfo('🔗 Connecting to MongoDB Atlas...');

    // Import mongoose and connect directly
    const mongoose = await import('mongoose');
    
    // Connection options for MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      appName: 'imoitc'
    };

    logInfo('📡 Establishing database connection...');
    
    // Simple connection without complex event handling
    await mongoose.connect(MONGODB_URI, options);
    
    const dbConnection = mongoose.connection;
    
    // Check connection state
    logInfo(`📊 MongoDB connection state: ${dbConnection.readyState}`);
    
    if (dbConnection.readyState === 1) {
      logInfo('✅ MongoDB Atlas connected successfully');
    } else {
      // Wait a moment and check again
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (dbConnection.readyState === 1) {
        logInfo('✅ MongoDB Atlas connected successfully after wait');
      } else {
        throw new Error(`MongoDB connection failed. State: ${dbConnection.readyState}`);
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

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      logInfo(`\n📭 ${signal} received, shutting down gracefully...`);
      
      // Close HTTP server
      server.close(() => {
        logInfo('✅ HTTP server closed');
      });

      // Close MongoDB connection
      if (dbConnection.readyState === 1) {
        try {
          await mongoose.disconnect();
          logInfo('✅ MongoDB connection closed');
        } catch (error) {
          logError('❌ Error closing MongoDB connection:', error);
        }
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
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
      logError('🔧 Troubleshooting: Check if your MongoDB Atlas IP whitelist includes Render.com IP addresses');
      logError('🔧 Troubleshooting: Verify your MongoDB Atlas cluster is running');
    }
    
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing
export { app };
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