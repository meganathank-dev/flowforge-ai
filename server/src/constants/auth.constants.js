/**
 * Authentication and security configuration constants.
 *
 * These values control security behavior such as account locking,
 * OTP generation, password hashing, and token management.
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
 * Number of cryptographically random bytes for refresh tokens.
 * Produces an 80-character hex string.
 */
export const REFRESH_TOKEN_BYTES = 40;

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
  REGISTRATION: 'registration',
  LOGOUT: 'logout',
  TOKEN_REUSE_DETECTED: 'token_reuse_detected',
  SESSION_REVOKED: 'session_revoked',
  OTP_VERIFICATION_FAILED: 'otp_verification_failed',
  OTP_VERIFIED: 'otp_verified',
});

/**
 * Array of all valid security event type values.
 */
export const SECURITY_EVENT_VALUES = Object.freeze(Object.values(SECURITY_EVENTS));
