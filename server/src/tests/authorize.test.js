import '../tests/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { ROLES } from '../constants/roles.js';

describe('Authorize Middleware', () => {
  it('should allow access for an authorized role', () => {
    const middleware = authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ORGANIZATION_ADMIN);

    const req = {
      user: { role: ROLES.ORGANIZATION_ADMIN },
    };

    let nextError = null;
    let nextCalled = false;
    const next = (err) => {
      nextError = err;
      nextCalled = true;
    };

    middleware(req, {}, next);

    assert.equal(nextCalled, true);
    assert.equal(nextError, undefined);
  });

  it('should return 403 Forbidden for an unauthorized role', () => {
    const middleware = authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ORGANIZATION_ADMIN);

    const req = {
      user: { role: ROLES.EMPLOYEE },
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    middleware(req, {}, next);

    assert.ok(nextError);
    assert.equal(nextError.statusCode, 403);
    assert.equal(nextError.message, 'You do not have permission to perform this action');
  });

  it('should return 401 Unauthorized if req.user is missing', () => {
    const middleware = authorizeRoles(ROLES.SUPER_ADMIN);

    const req = {};

    let nextError = null;
    const next = (err) => { nextError = err; };

    middleware(req, {}, next);

    assert.ok(nextError);
    assert.equal(nextError.statusCode, 401);
    assert.equal(nextError.message, 'Authentication required');
  });

  it('should return 401 Unauthorized if req.user.role is missing', () => {
    const middleware = authorizeRoles(ROLES.SUPER_ADMIN);

    const req = {
      user: { id: 'some-id' }, // No role
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    middleware(req, {}, next);

    assert.ok(nextError);
    assert.equal(nextError.statusCode, 401);
    assert.equal(nextError.message, 'Authentication required');
  });

  it('should support a single allowed role', () => {
    const middleware = authorizeRoles(ROLES.EMPLOYEE);

    const req = {
      user: { role: ROLES.EMPLOYEE },
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    middleware(req, {}, next);

    assert.equal(nextError, undefined);
  });

  it('should deny access if no roles are passed to configuration', () => {
    // If route is configured with authorizeRoles(), nobody is allowed
    const middleware = authorizeRoles();

    const req = {
      user: { role: ROLES.SUPER_ADMIN },
    };

    let nextError = null;
    const next = (err) => { nextError = err; };

    middleware(req, {}, next);

    assert.ok(nextError);
    assert.equal(nextError.statusCode, 403);
  });
});
