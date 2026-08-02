import PasswordReset from '../models/password-reset.model.js';

/**
 * Password reset repository.
 *
 * Encapsulates all database access for the PasswordReset model.
 * Controllers and services should use these methods
 * instead of querying the PasswordReset model directly.
 */

/**
 * Create a new password reset record.
 *
 * @param {object} params
 * @param {string} params.userId - The user's ObjectId
 * @param {string} params.otpHash - Bcrypt hash of the OTP
 * @param {Date} params.expiresAt - When the OTP expires
 * @returns {Promise<object>} The created password reset document
 */
export const createPasswordReset = async ({ userId, otpHash, expiresAt }) => {
  return PasswordReset.create({
    user: userId,
    otpHash,
    expiresAt,
  });
};

/**
 * Find the most recent active (unused, unexpired) password reset for a user.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object|null>} The password reset document or null
 */
export const findActiveResetByUser = async (userId) => {
  return PasswordReset.findOne({
    user: userId,
    used: false,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .exec();
};

/**
 * Atomically increment the OTP verification attempts counter.
 *
 * @param {string} resetId - The password reset document's ObjectId
 * @returns {Promise<object|null>} The updated document
 */
export const incrementAttempts = async (resetId) => {
  return PasswordReset.findByIdAndUpdate(
    resetId,
    { $inc: { attempts: 1 } },
    { new: true },
  ).exec();
};

/**
 * Mark a password reset record as used.
 *
 * @param {string} resetId - The password reset document's ObjectId
 * @returns {Promise<object|null>} The updated document
 */
export const markAsUsed = async (resetId) => {
  return PasswordReset.findByIdAndUpdate(
    resetId,
    { used: true },
    { new: true },
  ).exec();
};

/**
 * Invalidate all active password reset records for a user.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The update result
 */
export const invalidateAllForUser = async (userId) => {
  return PasswordReset.updateMany(
    { user: userId, used: false },
    { used: true },
  ).exec();
};
