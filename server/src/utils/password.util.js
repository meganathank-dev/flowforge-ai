import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants.js';

/**
 * Password strength validation rules.
 */
const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecialChar: true,
};

/**
 * Hash a plaintext password using bcrypt.
 *
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} The bcrypt hash
 * @throws {Error} If the password is not a non-empty string
 */
export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plaintext password against a bcrypt hash.
 *
 * @param {string} password - The plaintext password to check
 * @param {string} passwordHash - The bcrypt hash to compare against
 * @returns {Promise<boolean>} True if the password matches the hash
 */
export const comparePassword = async (password, passwordHash) => {
  if (!password || typeof password !== 'string') {
    return false;
  }

  if (!passwordHash || typeof passwordHash !== 'string') {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
};

/**
 * Validate password strength against security requirements.
 *
 * Returns an object with `isValid` and an array of `errors` describing
 * which rules were violated.
 *
 * @param {string} password - The password to validate
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters long`);
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(`Password must be at most ${PASSWORD_RULES.maxLength} characters long`);
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_RULES.requireDigit && !/\d/.test(password)) {
    errors.push('Password must contain at least one digit');
  }

  if (PASSWORD_RULES.requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
