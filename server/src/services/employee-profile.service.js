import * as employeeRepository from '../repositories/employee-profile.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import { hashPassword, validatePasswordStrength } from '../utils/password.util.js';
import { BadRequestError, ConflictError, NotFoundError } from '../errors/app.error.js';
import { ACCOUNT_STATUS } from '../constants/account-status.js';
import { ROLES } from '../constants/roles.js';

/**
 * Create a new employee within an organization.
 *
 * Uses compensating transaction logic since local MongoDB standalone instances
 * might not support replica set transactions.
 *
 * @param {string} tenantId - Authenticated user's organizationId
 * @param {object} params
 * @returns {Promise<object>}
 */
export const createEmployee = async (tenantId, {
  employeeId,
  email,
  password,
  firstName,
  lastName,
  title,
  skills,
  role = ROLES.EMPLOYEE
}) => {
  // Validate password strength
  const strength = validatePasswordStrength(password);
  if (!strength.isValid) {
    throw new BadRequestError('Password does not meet strength requirements', strength.errors);
  }

  // Check unique constraints before creation
  const existingByEmail = await userRepository.findUserByEmail(email);
  if (existingByEmail) {
    throw new ConflictError('An account with this email already exists');
  }

  const existingByEmpId = await userRepository.findUserByEmployeeId(employeeId);
  if (existingByEmpId) {
    throw new ConflictError('An account with this employee ID already exists');
  }

  const passwordHash = await hashPassword(password);

  let createdUser = null;
  let createdProfile = null;

  try {
    // 1. Create the User with organizationId
    createdUser = await userRepository.createUser({
      employeeId,
      email,
      passwordHash,
      role,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      organizationId: tenantId
    });

    // 2. Create the Employee Profile
    createdProfile = await employeeRepository.createProfile({
      user: createdUser._id,
      organizationId: tenantId,
      firstName,
      lastName,
      title,
      skills
    });

    // 3. Link profile back to user
    createdUser.profileId = createdProfile._id;
    await createdUser.save();

    return createdProfile;
  } catch (error) {
    // Compensating Rollback
    if (createdUser && !createdProfile) {
      await createdUser.deleteOne();
    }
    throw error; // Re-throw for global error handler
  }
};

/**
 * Get a list of employees for the current organization.
 *
 * @param {string} tenantId
 * @param {object} query
 * @returns {Promise<object>}
 */
export const getEmployees = async (tenantId, { page = 1, limit = 20, search } = {}) => {
  const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), 100);
  const safePage = Math.max(1, parseInt(page, 10));
  const skip = (safePage - 1) * safeLimit;

  const filters = {};
  if (search) {
    filters.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ];
  }

  const { data, total } = await employeeRepository.findManyByOrganization(tenantId, filters, {
    skip,
    limit: safeLimit
  });

  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit)
    }
  };
};

/**
 * Get employee details by ID, enforcing tenant isolation.
 *
 * @param {string} id
 * @param {string} tenantId
 * @returns {Promise<object>}
 */
export const getEmployeeById = async (id, tenantId) => {
  const employee = await employeeRepository.findByIdAndOrganization(id, tenantId);
  if (!employee) {
    throw new NotFoundError('Employee not found'); // Safe IDOR prevention
  }
  return employee;
};
