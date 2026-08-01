import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/app.error.js';
import { sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware.
 *
 * Normalizes Mongoose, Zod, and custom errors into a consistent response format.
 * In production, internal details are hidden from the client.
 *
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errors = [];

  // Custom application errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError' && err.errors) {
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // Mongoose cast error (bad ObjectId, etc.)
  else if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Mongoose duplicate key error
  else if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value for: ${field}`;
  }
  // Zod error
  else if (err.name === 'ZodError') {
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, { stack: err.stack });
  } else {
    logger.warn(`${statusCode} - ${message}`);
  }

  // In production, don't leak internal error details
  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage =
    isProduction && statusCode >= 500 ? 'Internal server error' : message;
  const responseErrors = isProduction && statusCode >= 500 ? [] : errors;

  sendError(res, {
    message: responseMessage,
    statusCode,
    errors: responseErrors,
  });
};
