import '../tests/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { requireOrganization } from '../middleware/tenant.middleware.js';
import { ROLES } from '../constants/roles.js';

describe('Organization Tenant Isolation & Middleware', () => {
  describe('requireOrganization middleware', () => {
    it('should allow super_admin without organizationId', () => {
      const req = { user: { role: ROLES.SUPER_ADMIN } };
      let nextCalled = false;

      requireOrganization(req, {}, (err) => {
        assert.equal(err, undefined);
        nextCalled = true;
      });

      assert.equal(nextCalled, true);
      assert.equal(req.tenantId, null);
    });

    it('should block employee without organizationId', () => {
      const req = { user: { role: ROLES.EMPLOYEE } };
      let nextErr;

      requireOrganization(req, {}, (err) => {
        nextErr = err;
      });

      assert.ok(nextErr);
      assert.equal(nextErr.statusCode, 403);
    });

    it('should set req.tenantId if user has organizationId', () => {
      const req = { user: { role: ROLES.EMPLOYEE, organizationId: 'org123' } };
      let nextCalled = false;

      requireOrganization(req, {}, (err) => {
        assert.equal(err, undefined);
        nextCalled = true;
      });

      assert.equal(nextCalled, true);
      assert.equal(req.tenantId, 'org123');
    });
  });
});
