import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import { REFRESH_TOKEN_BYTES } from '../constants/auth.constants.js';
import env from '../config/env.config.js';

/**
 * Token utility — JWT access tokens and secure refresh tokens.
 *
 * Access tokens use JWT with minimal claims.
 * Refresh tokens use cryptographically secure random values.
 * Only SHA-256 hashes of refresh tokens are stored in the database.
 */

/**
 * Generate a JWT access token with minimal claims.
 *
 * The payload contains ONLY:
 * - sub (userId)
 * - role
 * - iss (issuer)
 * - iat (issued at)
 * - exp (expiration)
 *
 * No email, no passwordHash, no PII.
 *
 * @param {string} userId - The user's ObjectId as a string
 * @param {string} role - The user's role
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      role,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
    },
  );
};

/**
 * Verify and decode a JWT access token.
 *
 * Validates:
 * - signature
 * - expiration
 * - issuer
 *
 * @param {string} token - The JWT to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If the token is invalid, expired, or tampered
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: env.JWT_ISSUER,
  });
};

/**
 * Generate a cryptographically secure refresh token.
 *
 * Uses crypto.randomBytes for CSPRNG.
 * Produces an 80-character hexadecimal string (40 bytes).
 *
 * @returns {string} Hex-encoded refresh token
 */
export const generateRefreshToken = () => {
  return randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
};

/**
 * Hash a token using SHA-256.
 *
 * Only the hash is stored in the database.
 * The raw token is NEVER persisted.
 *
 * @param {string} token - The raw token to hash
 * @returns {string} Hex-encoded SHA-256 hash
 */
export const hashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
};
