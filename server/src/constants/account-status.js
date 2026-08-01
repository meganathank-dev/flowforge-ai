/**
 * Account status constants.
 *
 * Defines the lifecycle states of a user account.
 */

export const ACCOUNT_STATUS = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  LOCKED: 'locked',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated',
});

/**
 * Array of all valid account status values.
 */
export const ACCOUNT_STATUS_VALUES = Object.freeze(Object.values(ACCOUNT_STATUS));

/**
 * Default status for newly created accounts.
 */
export const DEFAULT_ACCOUNT_STATUS = ACCOUNT_STATUS.PENDING;
