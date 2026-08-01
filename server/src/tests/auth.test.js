import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.util.js';
import { generateOTP, isValidOTPFormat } from '../utils/otp.util.js';
import {
  loginSchema,
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordResetVerifySchema,
  passwordResetCompleteSchema,
} from '../validators/auth.validator.js';

// ============================================================
// Password Utility Tests
// ============================================================

describe('Password Utility', () => {
  describe('hashPassword', () => {
    it('should produce a hash from a plaintext password', async () => {
      const password = 'SecurePass123!';
      const hash = await hashPassword(password);

      assert.ok(hash, 'Hash should be truthy');
      assert.notEqual(hash, password, 'Hash should differ from plaintext');
      assert.ok(hash.startsWith('$2'), 'Hash should be a bcrypt hash');
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'SecurePass123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      assert.notEqual(hash1, hash2, 'Hashes should differ due to unique salts');
    });

    it('should throw on empty password', async () => {
      await assert.rejects(
        () => hashPassword(''),
        { message: 'Password must be a non-empty string' },
      );
    });

    it('should throw on non-string password', async () => {
      await assert.rejects(
        () => hashPassword(12345),
        { message: 'Password must be a non-empty string' },
      );
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'SecurePass123!';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);

      assert.equal(result, true, 'Correct password should match');
    });

    it('should return false for incorrect password', async () => {
      const password = 'SecurePass123!';
      const hash = await hashPassword(password);
      const result = await comparePassword('WrongPassword456!', hash);

      assert.equal(result, false, 'Incorrect password should not match');
    });

    it('should return false for empty password', async () => {
      const hash = await hashPassword('SecurePass123!');
      const result = await comparePassword('', hash);

      assert.equal(result, false, 'Empty password should not match');
    });

    it('should return false for null hash', async () => {
      const result = await comparePassword('SecurePass123!', null);

      assert.equal(result, false, 'Null hash should return false');
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept a strong password', () => {
      const result = validatePasswordStrength('StrongPass1!');

      assert.equal(result.isValid, true);
      assert.equal(result.errors.length, 0);
    });

    it('should reject a password that is too short', () => {
      const result = validatePasswordStrength('Ab1!');

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('at least')));
    });

    it('should reject a password without uppercase', () => {
      const result = validatePasswordStrength('lowercase123!');

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('uppercase')));
    });

    it('should reject a password without lowercase', () => {
      const result = validatePasswordStrength('UPPERCASE123!');

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('lowercase')));
    });

    it('should reject a password without a digit', () => {
      const result = validatePasswordStrength('NoDigitsHere!');

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('digit')));
    });

    it('should reject a password without a special character', () => {
      const result = validatePasswordStrength('NoSpecial123');

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('special')));
    });

    it('should reject null/undefined passwords', () => {
      const result = validatePasswordStrength(null);

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('required')));
    });

    it('should collect multiple errors', () => {
      const result = validatePasswordStrength('ab');

      assert.equal(result.isValid, false);
      assert.ok(result.errors.length > 1, 'Should report multiple violations');
    });
  });
});

// ============================================================
// OTP Utility Tests
// ============================================================

describe('OTP Utility', () => {
  describe('generateOTP', () => {
    it('should generate an OTP of the expected default length (6 digits)', () => {
      const otp = generateOTP();

      assert.equal(otp.length, 6, 'OTP should be 6 characters long');
    });

    it('should generate an OTP containing only numeric characters', () => {
      const otp = generateOTP();

      assert.match(otp, /^\d+$/, 'OTP should contain only digits');
    });

    it('should generate an OTP of custom length', () => {
      const otp = generateOTP(8);

      assert.equal(otp.length, 8, 'OTP should be 8 characters long');
      assert.match(otp, /^\d+$/, 'OTP should contain only digits');
    });

    it('should generate different OTPs on successive calls', () => {
      // Generate many OTPs to ensure they are not all the same
      const otps = new Set();
      for (let i = 0; i < 20; i++) {
        otps.add(generateOTP());
      }

      assert.ok(otps.size > 1, 'Multiple OTP generations should produce varied results');
    });

    it('should throw for invalid length', () => {
      assert.throws(
        () => generateOTP(2),
        { message: 'OTP length must be an integer between 4 and 10' },
      );
    });

    it('should zero-pad short OTPs', () => {
      // Generate many OTPs — some will start with 0 naturally
      // Just verify the length is always correct
      for (let i = 0; i < 50; i++) {
        const otp = generateOTP(6);
        assert.equal(otp.length, 6, 'OTP should always be 6 characters');
      }
    });
  });

  describe('isValidOTPFormat', () => {
    it('should return true for valid OTP format', () => {
      assert.equal(isValidOTPFormat('123456'), true);
    });

    it('should return true for OTP with leading zeros', () => {
      assert.equal(isValidOTPFormat('000001'), true);
    });

    it('should return false for OTP with wrong length', () => {
      assert.equal(isValidOTPFormat('12345'), false);
      assert.equal(isValidOTPFormat('1234567'), false);
    });

    it('should return false for non-numeric OTP', () => {
      assert.equal(isValidOTPFormat('12345a'), false);
      assert.equal(isValidOTPFormat('abcdef'), false);
    });

    it('should return false for null/undefined/empty', () => {
      assert.equal(isValidOTPFormat(null), false);
      assert.equal(isValidOTPFormat(undefined), false);
      assert.equal(isValidOTPFormat(''), false);
    });
  });
});

// ============================================================
// Auth Validator Tests
// ============================================================

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'SecurePass123!',
      });

      assert.equal(result.success, true);
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({
        password: 'SecurePass123!',
      });

      assert.equal(result.success, false);
    });

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'SecurePass123!',
      });

      assert.equal(result.success, false);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
      });

      assert.equal(result.success, false);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'short',
      });

      assert.equal(result.success, false);
    });

    it('should normalize email to lowercase', () => {
      const result = loginSchema.safeParse({
        email: 'USER@Example.COM',
        password: 'SecurePass123!',
      });

      assert.equal(result.success, true);
      assert.equal(result.data.email, 'user@example.com');
    });
  });

  describe('passwordChangeSchema', () => {
    it('should accept valid password change data', () => {
      const result = passwordChangeSchema.safeParse({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
        confirmNewPassword: 'NewPassword456!',
      });

      assert.equal(result.success, true);
    });

    it('should reject mismatched new password and confirmation', () => {
      const result = passwordChangeSchema.safeParse({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
        confirmNewPassword: 'DifferentPassword789!',
      });

      assert.equal(result.success, false);
    });

    it('should reject when new password equals current password', () => {
      const result = passwordChangeSchema.safeParse({
        currentPassword: 'SamePassword123!',
        newPassword: 'SamePassword123!',
        confirmNewPassword: 'SamePassword123!',
      });

      assert.equal(result.success, false);
    });
  });

  describe('passwordResetRequestSchema', () => {
    it('should accept a valid email', () => {
      const result = passwordResetRequestSchema.safeParse({
        email: 'user@example.com',
      });

      assert.equal(result.success, true);
    });

    it('should reject an invalid email', () => {
      const result = passwordResetRequestSchema.safeParse({
        email: 'not-valid',
      });

      assert.equal(result.success, false);
    });
  });

  describe('passwordResetVerifySchema', () => {
    it('should accept valid email and OTP', () => {
      const result = passwordResetVerifySchema.safeParse({
        email: 'user@example.com',
        otp: '123456',
      });

      assert.equal(result.success, true);
    });

    it('should reject invalid OTP format', () => {
      const result = passwordResetVerifySchema.safeParse({
        email: 'user@example.com',
        otp: 'abc',
      });

      assert.equal(result.success, false);
    });
  });

  describe('passwordResetCompleteSchema', () => {
    it('should accept valid completion data', () => {
      const result = passwordResetCompleteSchema.safeParse({
        email: 'user@example.com',
        otp: '123456',
        newPassword: 'NewPassword456!',
        confirmNewPassword: 'NewPassword456!',
      });

      assert.equal(result.success, true);
    });

    it('should reject mismatched passwords', () => {
      const result = passwordResetCompleteSchema.safeParse({
        email: 'user@example.com',
        otp: '123456',
        newPassword: 'NewPassword456!',
        confirmNewPassword: 'Mismatch789!',
      });

      assert.equal(result.success, false);
    });
  });
});
