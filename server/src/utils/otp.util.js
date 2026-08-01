import { randomInt } from 'node:crypto';
import { OTP_LENGTH } from '../constants/auth.constants.js';

/**
 * Generate a cryptographically secure numeric OTP.
 *
 * Uses node:crypto randomInt for cryptographically secure randomness.
 * The OTP is a zero-padded numeric string of the configured length.
 *
 * @param {number} [length=OTP_LENGTH] - Number of digits in the OTP
 * @returns {string} A numeric OTP string
 */
export const generateOTP = (length = OTP_LENGTH) => {
  if (!Number.isInteger(length) || length < 4 || length > 10) {
    throw new Error('OTP length must be an integer between 4 and 10');
  }

  const min = 0;
  const max = Math.pow(10, length);

  // randomInt is cryptographically secure (uses CSPRNG)
  const otp = randomInt(min, max);

  // Zero-pad to ensure consistent length
  return otp.toString().padStart(length, '0');
};

/**
 * Validate that a string looks like a valid OTP format.
 *
 * Checks that the value is a numeric string of the expected length.
 * This is a format check only — it does NOT verify the OTP value
 * against a stored hash.
 *
 * @param {string} otp - The OTP string to validate
 * @param {number} [length=OTP_LENGTH] - Expected OTP length
 * @returns {boolean} True if the OTP has the correct format
 */
export const isValidOTPFormat = (otp, length = OTP_LENGTH) => {
  if (!otp || typeof otp !== 'string') {
    return false;
  }

  if (otp.length !== length) {
    return false;
  }

  return /^\d+$/.test(otp);
};
