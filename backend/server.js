import dotenv from 'dotenv';
import app from './src/app.js';
import databaseConfig from './src/config/database.js';
import { logInfo, logError } from './src/utils/logger.js';

// Load environment variables FIRST
dotenv.config();

const startServer = async () => {
  try {
    console.log("🚀 SERVER.JS STARTING - VERSION 2");

    // Connect to database
    const dbConnection = await databaseConfig.connect(); // connect() returns mongoose.connection

    // ✅ Log successful connection
    if (dbConnection.readyState === 1) {
      logInfo('✅ MongoDB connected successfully');
    } else {
      logError('❌ MongoDB connection not established, current state:', dbConnection.readyState);
      process.exit(1);
    }

    // Set database connection in app instance
    app.dbConnection = dbConnection;

    // Check database health (simple check)
    const dbHealth = dbConnection.readyState === 1 ? 'connected' : 'disconnected';
    app.setDatabaseHealth(dbHealth);

    // Start the Express server
    const server = app.start();
    app.server = server;

    logInfo('✅ Application started successfully');

  } catch (error) {
    logError('❌ Failed to start application:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing
export { app };
