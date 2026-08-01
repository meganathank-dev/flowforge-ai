import env from './config/env.config.js';
import { connectDB, gracefulShutdown } from './config/db.config.js';
import { createApp } from './app.js';
import logger from './utils/logger.js';

const start = async () => {
  // Connect to MongoDB
  await connectDB(env.MONGODB_URI);

  // Create and start the Express app
  const app = createApp(env);

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`📍 API base: http://localhost:${env.PORT}/api/v1`);
  });

  // Graceful shutdown handlers
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await gracefulShutdown();
      logger.info('Server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle unhandled rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

start();
