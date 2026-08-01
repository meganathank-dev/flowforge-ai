import { comparePassword } from '../utils/password.util.js';
import { ACCOUNT_STATUS } from '../constants/account-status.js';
import { MAX_FAILED_LOGIN_ATTEMPTS } from '../constants/auth.constants.js';
import * as userRepository from '../repositories/user.repository.js';

/**
 * Authentication service — internal security logic.
 *
 * This service contains the core authentication business logic
 * for password verification, account status checking, lock management,
 * and failed-login handling.
 *
 * IMPORTANT: This service does NOT:
 * - Create HTTP routes or responses
 * - Generate JWTs or tokens
 * - Implement login/registration endpoints
 *
 * Those will be implemented in Phase 1B controllers/routes.
 */

/**
 * Verify a plaintext password against a user's stored password hash.
 *
 * @param {string} password - The plaintext password to check
 * @param {string} passwordHash - The stored bcrypt hash
 * @returns {Promise<boolean>} True if the password matches
 */
export const verifyPassword = async (password, passwordHash) => {
  return comparePassword(password, passwordHash);
};

/**
 * Check if an account status allows login.
 *
 * @param {string} accountStatus - The user's current account status
 * @returns {{ allowed: boolean, reason: string|null }}
 */
export const checkAccountStatus = (accountStatus) => {
  switch (accountStatus) {
    case ACCOUNT_STATUS.ACTIVE:
      return { allowed: true, reason: null };

    case ACCOUNT_STATUS.PENDING:
      return { allowed: false, reason: 'Account is pending activation' };

    case ACCOUNT_STATUS.LOCKED:
      return { allowed: false, reason: 'Account is locked' };

    case ACCOUNT_STATUS.SUSPENDED:
      return { allowed: false, reason: 'Account has been suspended' };

    case ACCOUNT_STATUS.DEACTIVATED:
      return { allowed: false, reason: 'Account has been deactivated' };

    default:
      return { allowed: false, reason: 'Invalid account status' };
  }
};

/**
 * Check if a user's account lock has expired.
 *
 * If the lock has expired, the lock state is automatically cleared
 * and the account status is restored to active.
 *
 * @param {object} user - The user document
 * @returns {Promise<{ isLocked: boolean, user: object }>}
 */
export const checkLockState = async (user) => {
  // Not locked
  if (user.accountStatus !== ACCOUNT_STATUS.LOCKED || !user.lockedUntil) {
    return { isLocked: false, user };
  }

  // Lock has expired — clear it
  if (new Date() > user.lockedUntil) {
    const updatedUser = await userRepository.resetFailedLoginState(user._id);

    // Restore to active if status was locked
    if (updatedUser.accountStatus === ACCOUNT_STATUS.LOCKED) {
      updatedUser.accountStatus = ACCOUNT_STATUS.ACTIVE;
      await updatedUser.save();
    }

    return { isLocked: false, user: updatedUser };
  }

  // Still locked
  return { isLocked: true, user };
};

/**
 * Handle a failed login attempt for a user.
 *
 * Increments the failed login counter and locks the account
 * if the maximum attempts are reached.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<{ locked: boolean, attemptsRemaining: number }>}
 */
export const handleFailedLogin = async (userId) => {
  const user = await userRepository.recordFailedLoginAttempt(userId);
  const attemptsRemaining = Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - user.failedLoginAttempts);

  if (user.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    await userRepository.lockAccount(userId);
    return { locked: true, attemptsRemaining: 0 };
  }

  return { locked: false, attemptsRemaining };
};

/**
 * Reset failed login state after a successful authentication.
 *
 * Clears the failed attempt counter and removes any lock.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The updated user document
 */
export const resetFailedAttempts = async (userId) => {
  return userRepository.resetFailedLoginState(userId);
};
