import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { createRateLimiter } from '../../middleware/rate-limit.middleware.js';
import {
  registrationSchema,
  loginSchema,
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordResetVerifySchema,
  passwordResetCompleteSchema,
} from '../../validators/auth.validator.js';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  changePassword,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from '../../controllers/auth.controller.js';

const router = Router();

/**
 * Strict rate limiter for security-sensitive endpoints.
 * 10 requests per 15-minute window.
 */
const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

/**
 * Auth rate limiter for registration.
 * 20 requests per 15-minute window.
 */
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

// ── Public Routes ─────────────────────────────────────────────────

router.post('/register', authRateLimiter, validate({ body: registrationSchema }), register);
router.post('/login', strictRateLimiter, validate({ body: loginSchema }), login);
router.post('/refresh', strictRateLimiter, refresh);
router.post('/forgot-password', strictRateLimiter, validate({ body: passwordResetRequestSchema }), forgotPassword);
router.post('/verify-reset-otp', strictRateLimiter, validate({ body: passwordResetVerifySchema }), verifyResetOtp);
router.post('/reset-password', strictRateLimiter, validate({ body: passwordResetCompleteSchema }), resetPassword);

// ── Authenticated Routes ──────────────────────────────────────────

router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, validate({ body: passwordChangeSchema }), changePassword);

export default router;
