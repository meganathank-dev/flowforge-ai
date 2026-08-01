import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB using the provided URI.
 * @param {string} uri - MongoDB connection string
 */
export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    logger.info('📦 MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

/**
 * Get the current MongoDB connection status.
 * @returns {string} Connection state name
 */
export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Gracefully close the MongoDB connection.
 */
export const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error.message);
  }
};
