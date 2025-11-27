import dotenv from 'dotenv';
import app from './src/app.js';
import appConfig from './src/config/app.js'; // ✅ Import appConfig
import { connectDatabase, checkDatabaseHealth } from './src/utils/database.js';
import { logInfo, logError } from './src/utils/logger.js';

// Load environment variables first
dotenv.config();

// Start the application
const startServer = async () => {
  try {
    // Connect to database
    const dbConnection = await connectDatabase();

    // Set database connection in app instance
    app.dbConnection = dbConnection;

    // Check database health and set status
    const dbHealth = await checkDatabaseHealth();
    if (app.setDatabaseHealth) app.setDatabaseHealth(dbHealth);

    // Start the server
    const server = app.start();
    app.server = server;

    logInfo(`✅ ${appConfig.app.name} started successfully on port ${app.port || process.env.PORT}`);
  } catch (error) {
    logError('❌ Failed to start application:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { app };
