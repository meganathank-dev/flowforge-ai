import Session from '../models/session.model.js';

/**
 * Session repository.
 *
 * Encapsulates all database access for the Session model.
 * Controllers and services should use these methods
 * instead of querying the Session model directly.
 */

/**
 * Create a new session record.
 *
 * @param {object} params
 * @param {string} params.userId - The user's ObjectId
 * @param {string} params.tokenHash - SHA-256 hash of the refresh token
 * @param {Date} params.expiresAt - When the session expires
 * @param {object} [params.metadata] - Safe session metadata (IP, user agent, device type)
 * @returns {Promise<object>} The created session document
 */
export const createSession = async ({ userId, tokenHash, expiresAt, metadata = {} }) => {
  return Session.create({
    user: userId,
    tokenHash,
    expiresAt,
    metadata: {
      ipAddress: metadata.ipAddress || null,
      userAgent: metadata.userAgent || null,
      deviceType: metadata.deviceType || null,
    },
  });
};

/**
 * Find a session by its token hash.
 *
 * IMPORTANT: This method does NOT filter by revokedAt.
 * It returns the session regardless of revocation state so the
 * calling service can distinguish between:
 * - nonexistent token (no session found)
 * - active session (revokedAt is null)
 * - revoked/rotated session (revokedAt is set — indicates token reuse)
 *
 * @param {string} tokenHash - SHA-256 hash of the refresh token
 * @returns {Promise<object|null>} The session document or null
 */
export const findSessionByTokenHash = async (tokenHash) => {
  return Session.findOne({ tokenHash }).exec();
};

/**
 * Revoke a session by setting revokedAt.
 *
 * @param {string} sessionId - The session's ObjectId
 * @returns {Promise<object|null>} The updated session document
 */
export const revokeSession = async (sessionId) => {
  return Session.findByIdAndUpdate(
    sessionId,
    { revokedAt: new Date() },
    { new: true },
  ).exec();
};

/**
 * Revoke all active sessions for a user.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The update result
 */
export const revokeAllUserSessions = async (userId) => {
  return Session.updateMany(
    { user: userId, revokedAt: null },
    { revokedAt: new Date() },
  ).exec();
};

/**
 * Atomically rotate a session's token hash and expiry.
 *
 * The filter ensures that only an active (non-revoked) session can be rotated.
 * If the session was already revoked or rotated by another request,
 * this returns null — the caller must treat it as token reuse.
 *
 * @param {string} sessionId - The session's ObjectId
 * @param {string} newTokenHash - SHA-256 hash of the new refresh token
 * @param {Date} newExpiresAt - New expiration date
 * @returns {Promise<object|null>} The updated session or null if already revoked
 */
export const rotateSession = async (sessionId, newTokenHash, newExpiresAt) => {
  return Session.findOneAndUpdate(
    {
      _id: sessionId,
      revokedAt: null,
    },
    {
      $set: {
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
      },
    },
    { new: true },
  ).exec();
};

/**
 * Find all active (non-revoked) sessions for a user.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<Array>} Array of active session documents
 */
export const findActiveSessionsByUser = async (userId) => {
  return Session.find({ user: userId, revokedAt: null })
    .sort({ createdAt: -1 })
    .exec();
};
