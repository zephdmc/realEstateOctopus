import mongoose from 'mongoose';

// Database configuration
const databaseConfig = {
  // MongoDB connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
  },

  // Connection string
  getConnectionString: () => {
    const {
      MONGODB_USERNAME,
      MONGODB_PASSWORD,
      MONGODB_HOST,
      MONGODB_PORT,
      MONGODB_DATABASE,
      MONGODB_URI
    } = process.env;

    // If full URI is provided, use it
    if (MONGODB_URI) {
      return MONGODB_URI;
    }

    // Otherwise construct from individual parts
    const auth = MONGODB_USERNAME && MONGODB_PASSWORD 
      ? `${MONGODB_USERNAME}:${MONGODB_PASSWORD}@`
      : '';

    const host = MONGODB_HOST || 'localhost';
    const port = MONGODB_PORT || '27017';

    return `mongodb://${auth}${host}:${port}/${MONGODB_DATABASE}`;
  },

  // Database event handlers
  eventHandlers: {
    onConnected: () => {
      console.log('✅ MongoDB connected successfully');
    },

    onError: (error) => {
      console.error('❌ MongoDB connection error:', error);
    },

    onDisconnected: () => {
      console.log('⚠️ MongoDB disconnected');
    },

    onReconnected: () => {
      console.log('🔁 MongoDB reconnected');
    }
  },

  // Configure mongoose
  configureMongoose: () => {
    // Set strict query mode
    mongoose.set('strictQuery', true);

    // Set debug mode based on environment
    mongoose.set('debug', process.env.NODE_ENV === 'development');

    // Set global plugins
    // mongoose.plugin(require('mongoose-autopopulate'));
  }
};

export default databaseConfig;