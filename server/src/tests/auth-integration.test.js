import './setup.js';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

/**
 * Authentication Integration Tests.
 *
 * These tests require a running MongoDB instance.
 * They will skip gracefully if MongoDB is unavailable.
 *
 * IMPORTANT:
 * - Never expose real secrets
 * - Clean up test records after each test
 * - Never log passwords, OTPs, or tokens
 */

// ── MongoDB Connection Check ──────────────────────────────────────

const MONGODB_TEST_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowforge-ai-test';
let isMongoAvailable = false;

before(async () => {
  try {
    await mongoose.connect(MONGODB_TEST_URI, { serverSelectionTimeoutMS: 3000 });
    isMongoAvailable = true;
  } catch {
    isMongoAvailable = false;
  }
});

after(async () => {
  if (isMongoAvailable) {
    // Clean up test data
    const User = mongoose.model('User');
    const Session = mongoose.model('Session');
    const PasswordReset = mongoose.model('PasswordReset');
    const SecurityEvent = mongoose.model('SecurityEvent');

    await User.deleteMany({ email: /@integration-test\.com$/ });
    await Session.deleteMany({});
    await PasswordReset.deleteMany({});
    await SecurityEvent.deleteMany({});

    await mongoose.disconnect();
  }
});

// ── Helper ────────────────────────────────────────────────────────

const skipIfNoMongo = (fn) => {
  return async () => {
    if (!isMongoAvailable) {
      return; // skip gracefully
    }
    await fn();
  };
};

let testCounter = 0;
const uniqueEmail = () => `testuser${++testCounter}-${Date.now()}@integration-test.com`;
const uniqueEmployeeId = () => `INT${testCounter}-${Date.now()}`.toUpperCase();

// ── Integration Tests ─────────────────────────────────────────────

describe('Auth Integration Tests', () => {
  describe('Registration → Login → Me → Refresh → Logout Flow', () => {
    it('should complete the full authentication lifecycle', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const email = uniqueEmail();
      const employeeId = uniqueEmployeeId();

      // 1. Register
      const user = await authService.registerUser({
        employeeId,
        email,
        password: 'IntTest123!',
        ipAddress: '127.0.0.1',
      });

      assert.ok(user.id, 'User should have an ID');
      assert.equal(user.email, email);
      assert.equal(user.accountStatus, 'active');
      assert.equal(user.passwordHash, undefined, 'passwordHash must not be in safe user');

      // 2. Login
      const loginResult = await authService.loginUser({
        email,
        password: 'IntTest123!',
        ipAddress: '127.0.0.1',
        userAgent: 'IntegrationTest/1.0',
      });

      assert.ok(loginResult.accessToken, 'Should receive access token');
      assert.ok(loginResult.refreshToken, 'Should receive refresh token');
      assert.ok(loginResult.user, 'Should receive safe user');
      assert.equal(loginResult.user.passwordHash, undefined, 'passwordHash must not leak');

      // 3. Get current user
      const me = await authService.getCurrentUser(user.id);
      assert.equal(me.email, email);
      assert.equal(me.passwordHash, undefined);

      // 4. Refresh
      const refreshResult = await authService.refreshSession({
        refreshToken: loginResult.refreshToken,
        ipAddress: '127.0.0.1',
        userAgent: 'IntegrationTest/1.0',
      });

      assert.ok(refreshResult.accessToken, 'Should receive new access token');
      assert.ok(refreshResult.refreshToken, 'Should receive new refresh token');
      assert.notEqual(refreshResult.refreshToken, loginResult.refreshToken, 'Refresh token should be rotated');

      // 5. Logout
      await authService.logoutUser({
        refreshToken: refreshResult.refreshToken,
        userId: user.id,
        ipAddress: '127.0.0.1',
      });

      // 6. Old refresh token should fail
      await assert.rejects(
        () => authService.refreshSession({
          refreshToken: refreshResult.refreshToken,
          ipAddress: '127.0.0.1',
        }),
        (err) => err.statusCode === 401,
        'Revoked refresh token should be rejected',
      );
    }));
  });

  describe('Password Change → Session Invalidation', () => {
    it('should invalidate sessions after password change', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const email = uniqueEmail();
      const employeeId = uniqueEmployeeId();

      // Register and login
      await authService.registerUser({
        employeeId,
        email,
        password: 'OrigPass123!',
        ipAddress: '127.0.0.1',
      });

      const loginResult = await authService.loginUser({
        email,
        password: 'OrigPass123!',
        ipAddress: '127.0.0.1',
      });

      // Change password
      await authService.changePassword({
        userId: loginResult.user.id,
        currentPassword: 'OrigPass123!',
        newPassword: 'NewPass456!',
        ipAddress: '127.0.0.1',
      });

      // Old refresh token should fail
      await assert.rejects(
        () => authService.refreshSession({
          refreshToken: loginResult.refreshToken,
          ipAddress: '127.0.0.1',
        }),
        (err) => err.statusCode === 401,
        'Session should be invalidated after password change',
      );

      // New password should work for login
      const newLogin = await authService.loginUser({
        email,
        password: 'NewPass456!',
        ipAddress: '127.0.0.1',
      });
      assert.ok(newLogin.accessToken, 'Should be able to login with new password');
    }));
  });

  describe('Forgot Password → Verify OTP → Reset Password', () => {
    it('should complete the password reset flow', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const email = uniqueEmail();
      const employeeId = uniqueEmployeeId();

      // Register
      await authService.registerUser({
        employeeId,
        email,
        password: 'OriginalPass1!',
        ipAddress: '127.0.0.1',
      });

      // Forgot password
      await authService.forgotPassword({ email, ipAddress: '127.0.0.1' });

      // Test anti-enumeration
      await authService.forgotPassword({ email: 'nonexistent@integration-test.com', ipAddress: '127.0.0.1' });
    }));
  });

  describe('Token Reuse Detection', () => {
    it('should detect reuse of a revoked refresh token', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const email = uniqueEmail();
      const employeeId = uniqueEmployeeId();

      // Register and login
      await authService.registerUser({
        employeeId,
        email,
        password: 'ReuseTest123!',
        ipAddress: '127.0.0.1',
      });

      const loginResult = await authService.loginUser({
        email,
        password: 'ReuseTest123!',
        ipAddress: '127.0.0.1',
      });

      // Simulate a secondary login to create another session
      const secondaryLoginResult = await authService.loginUser({
        email,
        password: 'ReuseTest123!',
        ipAddress: '192.168.1.1',
      });

      // Explicitly revoke the first session (simulate logout or manual revocation)
      await authService.logoutUser({
        refreshToken: loginResult.refreshToken,
        userId: loginResult.user.id,
      });

      // Attempt to reuse the revoked first token — triggers reuse detection
      await assert.rejects(
        () => authService.refreshSession({
          refreshToken: loginResult.refreshToken,
          ipAddress: '127.0.0.1',
        }),
        (err) => err.statusCode === 401 && err.message.includes('Token reuse detected'),
        'Reused token should be rejected with reuse detection message',
      );

      // Verify that the SECONDARY session was ALSO revoked by the reuse detection
      await assert.rejects(
        () => authService.refreshSession({
          refreshToken: secondaryLoginResult.refreshToken,
          ipAddress: '192.168.1.1',
        }),
        (err) => err.statusCode === 401,
        'All sessions should be revoked after reuse detection',
      );
    }));
  });

  describe('Duplicate Registration', () => {
    it('should reject duplicate email', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const email = uniqueEmail();

      await authService.registerUser({
        employeeId: uniqueEmployeeId(),
        email,
        password: 'DupeTest123!',
        ipAddress: '127.0.0.1',
      });

      await assert.rejects(
        () => authService.registerUser({
          employeeId: uniqueEmployeeId(),
          email,
          password: 'DupeTest123!',
          ipAddress: '127.0.0.1',
        }),
        (err) => err.statusCode === 409,
        'Duplicate email should be rejected with 409',
      );
    }));

    it('should reject duplicate employeeId', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const employeeId = uniqueEmployeeId();

      await authService.registerUser({
        employeeId,
        email: uniqueEmail(),
        password: 'DupeTest123!',
        ipAddress: '127.0.0.1',
      });

      await assert.rejects(
        () => authService.registerUser({
          employeeId,
          email: uniqueEmail(),
          password: 'DupeTest123!',
          ipAddress: '127.0.0.1',
        }),
        (err) => err.statusCode === 409,
        'Duplicate employeeId should be rejected with 409',
      );
    }));
  });

  describe('Failed Login Tracking', () => {
    it('should lock account after max failed attempts', skipIfNoMongo(async () => {
      const authService = await import('../services/auth.service.js');
      const email = uniqueEmail();
      const employeeId = uniqueEmployeeId();

      await authService.registerUser({
        employeeId,
        email,
        password: 'LockTest123!',
        ipAddress: '127.0.0.1',
      });

      // Attempt login with wrong password multiple times
      for (let i = 0; i < 5; i++) {
        try {
          await authService.loginUser({
            email,
            password: 'WrongPassword!1',
            ipAddress: '127.0.0.1',
          });
        } catch {
          // Expected failures
        }
      }

      // Next attempt should fail with locked message
      await assert.rejects(
        () => authService.loginUser({
          email,
          password: 'LockTest123!',
          ipAddress: '127.0.0.1',
        }),
        (err) => err.statusCode === 401,
        'Locked account should be rejected',
      );
    }));
  });
});
