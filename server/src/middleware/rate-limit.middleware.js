import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Create a rate limiter middleware.
 * @param {object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum requests per window
 * @returns {import('express').RequestHandler}
 */
export const createRateLimiter = ({ windowMs, max }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError(res, {
        message: 'Too many requests, please try again later',
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
      });
    },
  });
};
