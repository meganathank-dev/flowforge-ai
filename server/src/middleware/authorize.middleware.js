import { ForbiddenError, UnauthorizedError } from '../errors/app.error.js';

/**
 * Role-Based Access Control Middleware.
 *
 * Executes after `authenticate` middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 *
 * @param  {...string} allowedRoles - The roles permitted to access the route
 * @returns {import('express').RequestHandler}
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    // Fail safely if authenticate middleware didn't run or didn't populate req.user
    if (!req.user || !req.user.role) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    // Role is allowed, proceed to the next middleware/controller
    next();
  };
};
