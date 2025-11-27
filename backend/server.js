import dotenv from 'dotenv';
import app from './src/app.js';
import databaseConfig from './src/config/database.js';
import { logInfo, logError } from './src/utils/logger.js';

// Load environment variables FIRST
dotenv.config();

// Start the application
const startServer = async () => {
  try {
    // Connect to database
    const dbConnection = await databaseConfig.connectDatabase();

    // ✅ Explicitly log successful connection
    if (dbConnection.readyState === 1) {
      logInfo('✅ MongoDB connected successfully');
    } else {
      logError('❌ MongoDB connection not established, current state:', dbConnection.readyState);
      process.exit(1);
    }

    // Set database connection in app instance
    app.dbConnection = dbConnection;

    // Check database health and set status
    const dbHealth = databaseConfig.checkDatabaseHealth();
    app.setDatabaseHealth(dbHealth);

    // Start the server
    const server = app.start();

    // Store server reference for graceful shutdown
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
