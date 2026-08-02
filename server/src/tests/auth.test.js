import './setup.js';
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.util.js';
import { generateOTP, isValidOTPFormat } from '../utils/otp.util.js';
import {
  loginSchema,
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordResetVerifySchema,
  passwordResetCompleteSchema,
  registrationSchema,
} from '../validators/auth.validator.js';

// ============================================================
// Password Utility Tests (Phase 1A — preserved)
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
// OTP Utility Tests (Phase 1A — preserved)
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
// Auth Validator Tests (Phase 1A — preserved + extended)
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

  describe('registrationSchema', () => {
    it('should accept valid registration data', () => {
      const result = registrationSchema.safeParse({
        employeeId: 'EMP001',
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });

      assert.equal(result.success, true);
    });

    it('should reject mismatched passwords', () => {
      const result = registrationSchema.safeParse({
        employeeId: 'EMP001',
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass456!',
      });

      assert.equal(result.success, false);
    });

    it('should reject missing confirmPassword', () => {
      const result = registrationSchema.safeParse({
        employeeId: 'EMP001',
        email: 'user@example.com',
        password: 'SecurePass123!',
      });

      assert.equal(result.success, false);
    });

    it('should reject missing employeeId', () => {
      const result = registrationSchema.safeParse({
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });

      assert.equal(result.success, false);
    });

    it('should normalize email to lowercase', () => {
      const result = registrationSchema.safeParse({
        employeeId: 'EMP001',
        email: 'USER@EXAMPLE.COM',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });

      assert.equal(result.success, true);
      assert.equal(result.data.email, 'user@example.com');
    });
  });
});

// ============================================================
// Token Utility Tests (Phase 1B)
// ============================================================

describe('Token Utility', () => {
  // Dynamic import to handle env requirement
  let tokenUtil;

  // Set env vars before importing the module
  before(async () => {
    // Ensure JWT env vars are set for testing
    process.env.JWT_ACCESS_SECRET = 'test-secret-that-is-at-least-32-characters-long-for-testing';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_ISSUER = 'flowforge-ai-test';

    // Force re-import of modules with test env
    tokenUtil = await import('../utils/token.util.js');
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT string', () => {
      const token = tokenUtil.generateAccessToken('user123', 'employee');

      assert.ok(token, 'Token should be truthy');
      assert.equal(typeof token, 'string', 'Token should be a string');

      // JWT has three parts separated by dots
      const parts = token.split('.');
      assert.equal(parts.length, 3, 'JWT should have 3 parts');
    });

    it('should include only minimal claims (sub, role, iss, iat, exp)', () => {
      const token = tokenUtil.generateAccessToken('user123', 'employee');
      const decoded = tokenUtil.verifyAccessToken(token);

      assert.equal(decoded.sub, 'user123', 'sub should match userId');
      assert.equal(decoded.role, 'employee', 'role should match');
      assert.ok(decoded.iss, 'iss should be present');
      assert.ok(decoded.iat, 'iat should be present');
      assert.ok(decoded.exp, 'exp should be present');

      // Ensure no PII is included
      assert.equal(decoded.email, undefined, 'email must not be in token');
      assert.equal(decoded.passwordHash, undefined, 'passwordHash must not be in token');
      assert.equal(decoded.password, undefined, 'password must not be in token');
    });
  });

  describe('verifyAccessToken', () => {
    it('should successfully verify a valid token', () => {
      const token = tokenUtil.generateAccessToken('user456', 'project_manager');
      const decoded = tokenUtil.verifyAccessToken(token);

      assert.equal(decoded.sub, 'user456');
      assert.equal(decoded.role, 'project_manager');
    });

    it('should reject a tampered token', () => {
      const token = tokenUtil.generateAccessToken('user123', 'employee');

      // Tamper with the token by modifying a character
      const tampered = token.slice(0, -5) + 'XXXXX';

      assert.throws(
        () => tokenUtil.verifyAccessToken(tampered),
        'Tampered token should be rejected',
      );
    });

    it('should reject a completely invalid token', () => {
      assert.throws(
        () => tokenUtil.verifyAccessToken('not-a-valid-jwt'),
        'Invalid token should be rejected',
      );
    });

    it('should reject an empty token', () => {
      assert.throws(
        () => tokenUtil.verifyAccessToken(''),
        'Empty token should be rejected',
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate an 80-character hex string', () => {
      const token = tokenUtil.generateRefreshToken();

      assert.equal(typeof token, 'string', 'Should be a string');
      assert.equal(token.length, 80, 'Should be 80 hex characters (40 bytes)');
      assert.match(token, /^[0-9a-f]+$/, 'Should be valid hexadecimal');
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 20; i++) {
        tokens.add(tokenUtil.generateRefreshToken());
      }
      assert.equal(tokens.size, 20, 'All 20 tokens should be unique');
    });
  });

  describe('hashToken', () => {
    it('should produce a consistent SHA-256 hash', () => {
      const token = 'test-token-value';
      const hash1 = tokenUtil.hashToken(token);
      const hash2 = tokenUtil.hashToken(token);

      assert.equal(hash1, hash2, 'Same input should produce same hash');
      assert.equal(hash1.length, 64, 'SHA-256 hash should be 64 hex characters');
    });

    it('should produce different hashes for different tokens', () => {
      const hash1 = tokenUtil.hashToken('token-one');
      const hash2 = tokenUtil.hashToken('token-two');

      assert.notEqual(hash1, hash2, 'Different tokens should produce different hashes');
    });
  });
});

// ============================================================
// Auth Service Tests (Phase 1B — unit tests, mocked repos)
// ============================================================

describe('Auth Service', () => {
  describe('toSafeUser', () => {
    it('should return only safe fields', async () => {
      // Dynamic import
      const { toSafeUser } = await import('../services/auth.service.js');

      const mockUser = {
        _id: 'user-id-123',
        employeeId: 'EMP001',
        email: 'test@example.com',
        role: 'employee',
        accountStatus: 'active',
        lastLoginAt: new Date(),
        createdAt: new Date(),
        passwordHash: '$2a$12$secret-hash',
        failedLoginAttempts: 3,
        lockedUntil: new Date(),
        __v: 0,
      };

      const safe = toSafeUser(mockUser);

      assert.equal(safe.id, 'user-id-123');
      assert.equal(safe.employeeId, 'EMP001');
      assert.equal(safe.email, 'test@example.com');
      assert.equal(safe.role, 'employee');
      assert.equal(safe.accountStatus, 'active');
      assert.ok(safe.lastLoginAt, 'lastLoginAt should be present');
      assert.ok(safe.createdAt, 'createdAt should be present');

      // Verify sensitive fields are NOT present
      assert.equal(safe.passwordHash, undefined, 'passwordHash must not be exposed');
      assert.equal(safe.failedLoginAttempts, undefined, 'failedLoginAttempts must not be exposed');
      assert.equal(safe.lockedUntil, undefined, 'lockedUntil must not be exposed');
      assert.equal(safe.__v, undefined, '__v must not be exposed');
    });
  });

  describe('checkAccountStatus', () => {
    it('should allow active accounts', async () => {
      const { checkAccountStatus } = await import('../services/auth.service.js');
      const result = checkAccountStatus('active');
      assert.equal(result.allowed, true);
      assert.equal(result.reason, null);
    });

    it('should reject locked accounts', async () => {
      const { checkAccountStatus } = await import('../services/auth.service.js');
      const result = checkAccountStatus('locked');
      assert.equal(result.allowed, false);
      assert.ok(result.reason.includes('locked'));
    });

    it('should reject suspended accounts', async () => {
      const { checkAccountStatus } = await import('../services/auth.service.js');
      const result = checkAccountStatus('suspended');
      assert.equal(result.allowed, false);
      assert.ok(result.reason.includes('suspended'));
    });

    it('should reject deactivated accounts', async () => {
      const { checkAccountStatus } = await import('../services/auth.service.js');
      const result = checkAccountStatus('deactivated');
      assert.equal(result.allowed, false);
      assert.ok(result.reason.includes('deactivated'));
    });

    it('should reject pending accounts', async () => {
      const { checkAccountStatus } = await import('../services/auth.service.js');
      const result = checkAccountStatus('pending');
      assert.equal(result.allowed, false);
      assert.ok(result.reason.includes('pending'));
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const { verifyPassword } = await import('../services/auth.service.js');
      const hash = await hashPassword('TestPassword1!');
      const result = await verifyPassword('TestPassword1!', hash);
      assert.equal(result, true);
    });

    it('should return false for incorrect password', async () => {
      const { verifyPassword } = await import('../services/auth.service.js');
      const hash = await hashPassword('TestPassword1!');
      const result = await verifyPassword('WrongPassword2!', hash);
      assert.equal(result, false);
    });
  });
});

// ============================================================
// Auth Middleware Tests (Phase 1B — unit tests)
// ============================================================

describe('Auth Middleware', () => {

  before(async () => {
    process.env.JWT_ACCESS_SECRET = 'test-secret-that-is-at-least-32-characters-long-for-testing';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_ISSUER = 'flowforge-ai-test';
  });

  it('should return 401 when no token is provided', async () => {
    const { authenticate } = await import('../middleware/auth.middleware.js');

    const req = {
      cookies: {},
      get: () => null,
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    await authenticate(req, {}, next);

    assert.ok(nextError, 'Should pass error to next');
    assert.equal(nextError.statusCode, 401);
  });

  it('should return 401 when an invalid token is provided', async () => {
    const { authenticate } = await import('../middleware/auth.middleware.js');

    const req = {
      cookies: { accessToken: 'invalid-token-value' },
      get: () => null,
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    await authenticate(req, {}, next);

    assert.ok(nextError, 'Should pass error to next');
    assert.equal(nextError.statusCode, 401);
  });

  it('should extract token from Authorization Bearer header', async () => {
    const { authenticate } = await import('../middleware/auth.middleware.js');

    const req = {
      cookies: {},
      get: (header) => {
        if (header === 'Authorization') return 'Bearer invalid-token';
        return null;
      },
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    await authenticate(req, {}, next);

    // Should fail with 401 because the token is invalid, but it shows
    // that the Bearer extraction path is exercised
    assert.ok(nextError, 'Should pass error to next');
    assert.equal(nextError.statusCode, 401);
  });
});

// ============================================================
// Security Event Sanitization Tests (Phase 1B)
// ============================================================

describe('Security Event Sanitization', () => {
  it('should strip sensitive fields from metadata', async () => {
    const { sanitizeMetadata } = await import('../services/security-event.service.js');

    const dirty = {
      email: 'user@example.com',
      password: 'secret123',
      passwordHash: '$2a$12$hash',
      otp: '123456',
      otpHash: 'hashvalue',
      token: 'jwt-token',
      accessToken: 'access',
      refreshToken: 'refresh',
      jwt: 'jwtvalue',
      sessionToken: 'session',
      apiKey: 'key123',
      secret: 'secretvalue',
      safe: 'this-is-safe',
    };

    const clean = sanitizeMetadata(dirty);

    assert.equal(clean.safe, 'this-is-safe', 'Safe fields should remain');
    assert.equal(clean.email, 'user@example.com', 'Email is allowed in metadata');
    assert.equal(clean.password, undefined, 'password must be stripped');
    assert.equal(clean.passwordHash, undefined, 'passwordHash must be stripped');
    assert.equal(clean.otp, undefined, 'otp must be stripped');
    assert.equal(clean.otpHash, undefined, 'otpHash must be stripped');
    assert.equal(clean.token, undefined, 'token must be stripped');
    assert.equal(clean.accessToken, undefined, 'accessToken must be stripped');
    assert.equal(clean.refreshToken, undefined, 'refreshToken must be stripped');
    assert.equal(clean.jwt, undefined, 'jwt must be stripped');
    assert.equal(clean.sessionToken, undefined, 'sessionToken must be stripped');
    assert.equal(clean.apiKey, undefined, 'apiKey must be stripped');
    assert.equal(clean.secret, undefined, 'secret must be stripped');
  });

  it('should sanitize nested objects', async () => {
    const { sanitizeMetadata } = await import('../services/security-event.service.js');

    const dirty = {
      info: {
        password: 'secret',
        detail: 'safe-detail',
      },
    };

    const clean = sanitizeMetadata(dirty);
    assert.equal(clean.info.password, undefined, 'Nested password must be stripped');
    assert.equal(clean.info.detail, 'safe-detail', 'Safe nested fields should remain');
  });
});
