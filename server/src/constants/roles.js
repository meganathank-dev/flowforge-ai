/**
 * User role constants.
 *
 * Defines the hierarchy of roles within the system.
 * Roles are ordered from highest privilege to lowest.
 */

export const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ORGANIZATION_ADMIN: 'organization_admin',
  PROJECT_MANAGER: 'project_manager',
  TEAM_LEADER: 'team_leader',
  EMPLOYEE: 'employee',
});

/**
 * Array of all valid role values.
 */
export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

/**
 * Default role assigned to new users.
 */
export const DEFAULT_ROLE = ROLES.EMPLOYEE;
