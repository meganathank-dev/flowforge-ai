import { ForbiddenError, UnauthorizedError } from '../errors/app.error.js';
import { ROLES } from '../constants/roles.js';

/**
 * Tenant isolation middleware.
 *
 * Ensures the authenticated user belongs to an organization before allowing
 * access to organization-scoped routes. Extracts the organizationId from
 * the server-validated JWT (via req.user) and sets it as req.tenantId.
 *
 * SECURITY:
 * - Must run AFTER authenticate middleware.
 * - Never trusts any organization ID supplied in req.body, req.query, or req.params.
 * - `super_admin` is a global role and bypasses this check, allowing global access
 *   where permitted.
 */
export const requireOrganization = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  // super_admin operates globally and may not have an organization
  if (req.user.role === ROLES.SUPER_ADMIN) {
    req.tenantId = req.user.organizationId || null;
    return next();
  }

  // All other roles must belong to an organization
  if (!req.user.organizationId) {
    return next(new ForbiddenError('User does not belong to an organization'));
  }

  // Set the tenant context for downstream controllers/services
  req.tenantId = req.user.organizationId;

  next();
};
