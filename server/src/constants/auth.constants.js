/**
 * Authentication and security configuration constants.
 *
 * These values control security behavior such as account locking,
 * OTP generation, and password hashing.
 *
 * NOTE: This file does NOT include JWT configuration.
 *       JWT will be added in Phase 1B.
 */

/**
 * Maximum number of consecutive failed login attempts
 * before the account is locked.
 */
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;

/**
 * Duration (in minutes) for which an account remains locked
 * after exceeding the maximum failed login attempts.
 */
export const ACCOUNT_LOCK_DURATION_MINUTES = 15;

/**
 * Length of generated OTP codes (number of digits).
 */
export const OTP_LENGTH = 6;

/**
 * OTP expiry time in minutes.
 */
export const OTP_EXPIRY_MINUTES = 10;

/**
 * Maximum number of OTP verification attempts allowed
 * before the OTP is invalidated.
 */
export const OTP_MAX_ATTEMPTS = 3;

/**
 * Bcrypt salt rounds (work factor) for password hashing.
 * A value of 12 provides a good balance between security and performance.
 */
export const BCRYPT_SALT_ROUNDS = 12;

/**
 * Security event types for audit logging.
 */
export const SECURITY_EVENTS = Object.freeze({
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  ACCOUNT_LOCKED: 'account_locked',
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',
});

/**
 * Array of all valid security event type values.
 */
export const SECURITY_EVENT_VALUES = Object.freeze(Object.values(SECURITY_EVENTS));
