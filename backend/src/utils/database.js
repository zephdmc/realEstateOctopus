import mongoose from 'mongoose';
import { logInfo, logError } from './logger.js';

// Database connection
export const connectDatabase = async () => {
    try {
      console.log('url', process.env.MONGODB_URI)
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logInfo(`MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      logInfo('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logError('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logInfo('Mongoose disconnected from MongoDB');
    });

    // Close connection on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logInfo('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logError('Database connection failed:', error);
    process.exit(1);
  }
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      database: mongoose.connection.db.databaseName,
      readyState: mongoose.connection.readyState
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      readyState: mongoose.connection.readyState
    };
  }
};

// Database utilities
export const databaseUtils = {
  // Clear test database
  async clearTestDatabase() {
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connection.dropDatabase();
    }
  },

  // Close database connection
  async closeConnection() {
    await mongoose.connection.close();
  },

  // Get database stats
  async getDatabaseStats() {
    return await mongoose.connection.db.stats();
  }
};