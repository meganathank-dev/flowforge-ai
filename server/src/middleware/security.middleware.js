import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { REQUEST_BODY_LIMIT } from '../constants/index.js';

/**
 * Apply security middleware to the Express app.
 * @param {import('express').Application} app
 * @param {object} options
 * @param {string} options.corsOrigin - Allowed CORS origin
 */
export const applySecurityMiddleware = (app, { corsOrigin }) => {
  // Helmet — sets various HTTP security headers
  app.use(helmet());

  // CORS — restrict cross-origin requests
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Parse JSON request bodies with size limit
  app.use(express.json({ limit: REQUEST_BODY_LIMIT }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

  // Parse cookies
  app.use(cookieParser());
};
