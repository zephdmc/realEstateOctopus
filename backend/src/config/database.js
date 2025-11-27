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
    if (MONGODB_URI) return MONGODB_URI;

    const auth = MONGODB_USERNAME && MONGODB_PASSWORD 
      ? `${MONGODB_USERNAME}:${MONGODB_PASSWORD}@`
      : '';
    const host = MONGODB_HOST || 'localhost';
    const port = MONGODB_PORT || '27017';

    return `mongodb://${auth}${host}:${port}/${MONGODB_DATABASE}`;
  },

  // Database event handlers
  eventHandlers: {
    onConnected: () => console.log('✅ MongoDB connected successfully'),
    onError: (error) => console.error('❌ MongoDB connection error:', error),
    onDisconnected: () => console.log('⚠️ MongoDB disconnected'),
    onReconnected: () => console.log('🔁 MongoDB reconnected'),
  },

  // Configure mongoose
  configureMongoose: () => {
    mongoose.set('strictQuery', true);
    mongoose.set('debug', process.env.NODE_ENV === 'development');
  },

  // Connect to database
  connectDatabase: async function () {
    try {
      this.configureMongoose();

      const connString = this.getConnectionString();
      const connection = await mongoose.connect(connString, this.options);

      // Attach events
      mongoose.connection.on('connected', this.eventHandlers.onConnected);
      mongoose.connection.on('error', this.eventHandlers.onError);
      mongoose.connection.on('disconnected', this.eventHandlers.onDisconnected);
      mongoose.connection.on('reconnected', this.eventHandlers.onReconnected);

      return mongoose.connection; // ✅ Return connection for server.js

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error; // Stop server if DB fails
    }
  },

  checkDatabaseHealth: () => {
    const state = mongoose.connection.readyState;
    return state === 1 ? 'connected' : 'disconnected';
  }
};

export default databaseConfig;
