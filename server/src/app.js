import express from 'express';
import morgan from 'morgan';
import { applySecurityMiddleware } from './middleware/security.middleware.js';
import { createRateLimiter } from './middleware/rate-limit.middleware.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import v1Routes from './routes/v1/index.js';
import { API_PREFIX } from './constants/index.js';
import logger from './utils/logger.js';

/**
 * Create and configure the Express application.
 * @param {object} config - Environment configuration
 * @returns {import('express').Application}
 */
export const createApp = (config) => {
  const app = express();

  // Security middleware (Helmet, CORS, body parser, cookie parser)
  applySecurityMiddleware(app, { corsOrigin: config.CORS_ORIGIN });

  // HTTP request logging
  const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(
    morgan(morganFormat, {
      stream: { write: (message) => logger.http(message.trim()) },
    }),
  );

  // Rate limiting
  app.use(
    API_PREFIX,
    createRateLimiter({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX_REQUESTS,
    }),
  );

  // API routes
  app.use(API_PREFIX, v1Routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
