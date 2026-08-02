import User from '../models/user.model.js';
import { ACCOUNT_STATUS } from '../constants/account-status.js';
import {
  MAX_FAILED_LOGIN_ATTEMPTS,
  ACCOUNT_LOCK_DURATION_MINUTES,
} from '../constants/auth.constants.js';

/**
 * User repository.
 *
 * Encapsulates all database access for the User model.
 * Controllers and services should use these methods
 * instead of querying the User model directly.
 */

/**
 * Find a user by email address.
 *
 * @param {string} email - The email to search for (case-insensitive via lowercase index)
 * @param {object} [options]
 * @param {boolean} [options.includePasswordHash=false] - Whether to include the passwordHash field
 * @returns {Promise<object|null>} The user document or null
 */
export const findUserByEmail = async (email, { includePasswordHash = false } = {}) => {
  const query = User.findOne({ email: email.toLowerCase().trim() });

  if (includePasswordHash) {
    query.select('+passwordHash');
  }

  return query.exec();
};

/**
 * Find a user by employee ID.
 *
 * @param {string} employeeId - The employee ID to search for
 * @param {object} [options]
 * @param {boolean} [options.includePasswordHash=false] - Whether to include the passwordHash field
 * @returns {Promise<object|null>} The user document or null
 */
export const findUserByEmployeeId = async (employeeId, { includePasswordHash = false } = {}) => {
  const query = User.findOne({ employeeId: employeeId.toUpperCase().trim() });

  if (includePasswordHash) {
    query.select('+passwordHash');
  }

  return query.exec();
};

/**
 * Find a user by their MongoDB ObjectId.
 *
 * @param {string} id - The user's ObjectId
 * @param {object} [options]
 * @param {boolean} [options.includePasswordHash=false] - Whether to include the passwordHash field
 * @returns {Promise<object|null>} The user document or null
 */
export const findUserById = async (id, { includePasswordHash = false } = {}) => {
  const query = User.findById(id);

  if (includePasswordHash) {
    query.select('+passwordHash');
  }

  return query.exec();
};

/**
 * Increment the failed login attempt counter for a user.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The updated user document
 */
export const recordFailedLoginAttempt = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { failedLoginAttempts: 1 } },
    { new: true },
  ).exec();
};

/**
 * Reset the failed login state (counter and lock) for a user.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The updated user document
 */
export const resetFailedLoginState = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    { new: true },
  ).exec();
};

/**
 * Lock a user's account for the configured duration.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The updated user document
 */
export const lockAccount = async (userId) => {
  const lockUntil = new Date(
    Date.now() + ACCOUNT_LOCK_DURATION_MINUTES * 60 * 1000,
  );

  return User.findByIdAndUpdate(
    userId,
    {
      accountStatus: ACCOUNT_STATUS.LOCKED,
      lockedUntil: lockUntil,
      failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS,
    },
    { new: true },
  ).exec();
};

/**
 * Update a user's password hash and record the change timestamp.
 *
 * @param {string} userId - The user's ObjectId
 * @param {string} newPasswordHash - The new bcrypt password hash
 * @returns {Promise<object>} The updated user document
 */
export const updatePassword = async (userId, newPasswordHash) => {
  return User.findByIdAndUpdate(
    userId,
    {
      passwordHash: newPasswordHash,
      passwordChangedAt: new Date(),
    },
    { new: true },
  ).exec();
};

/**
 * Update login metadata after a successful login.
 *
 * @param {string} userId - The user's ObjectId
 * @returns {Promise<object>} The updated user document
 */
export const updateLoginInfo = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    { new: true },
  ).exec();
};

/**
 * Create a new user document.
 *
 * Mongoose unique index violations (duplicate email or employeeId)
 * will throw a MongoDB error code 11000, which is handled by
 * the existing error middleware.
 *
 * @param {object} params
 * @param {string} params.employeeId - Unique employee identifier
 * @param {string} params.email - User's email address
 * @param {string} params.passwordHash - Bcrypt hash of the password
 * @param {string} [params.role] - User role (defaults to model default)
 * @param {string} [params.accountStatus] - Account status
 * @returns {Promise<object>} The created user document
 */
export const createUser = async ({ employeeId, email, passwordHash, role, accountStatus, organizationId, profileId }) => {
  const userData = {
    employeeId,
    email,
    passwordHash,
  };

  if (role) userData.role = role;
  if (accountStatus) userData.accountStatus = accountStatus;
  if (organizationId) userData.organizationId = organizationId;
  if (profileId) userData.profileId = profileId;

  return User.create(userData);
};
