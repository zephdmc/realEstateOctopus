import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDatabase, checkDatabaseHealth } from './src/utils/database.js';
import { logInfo, logError } from './src/utils/logger.js';

// Load environment variables first
dotenv.config();

const startServer = async () => {
  try {
    // Connect to database
    const dbConnection = await connectDatabase();
    app.dbConnection = dbConnection;
    logInfo('✅ MongoDB connected successfully');

    // Check database health
    const dbHealth = await checkDatabaseHealth();
    if (app.setDatabaseHealth) app.setDatabaseHealth(dbHealth);
    logInfo(`🩺 Database health: ${dbHealth.status || 'OK'}`);

    // Use dynamic port for Railway / fallback to config
    const port = process.env.PORT || app.port || 5000;

    // Start server
    const server = app.getApp().listen(port, () => {
      logInfo(`🚀 ${appConfig.app.name || 'Server'} running on port ${port}`);
      logInfo(`🌍 ENV: ${process.env.NODE_ENV || 'development'}`);
      logInfo(`🩺 Health check: /health`);
      logInfo(`🛂 CORS test: /test-cors`);
      logInfo(`📡 API test: /api/test-cors`);
    });

    // Store server reference for graceful shutdown
    app.server = server;

    // Handle process signals
    const shutdown = () => {
      logInfo('⚡ Shutting down gracefully...');
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    logInfo('✅ Application started successfully');

  } catch (error) {
    logError('❌ Failed to start application:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export app instance for testing
export { app };
