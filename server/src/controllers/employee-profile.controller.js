import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/response.js';
import * as employeeService from '../services/employee-profile.service.js';

/**
 * Create a new employee in the current organization.
 * POST /api/v1/employees
 */
export const createEmployee = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const employeeProfile = await employeeService.createEmployee(tenantId, req.body);

    sendSuccess(res, {
      data: employeeProfile,
      message: 'Employee created successfully',
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get employees for the current organization.
 * GET /api/v1/employees
 */
export const getEmployees = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const result = await employeeService.getEmployees(tenantId, req.query);

    sendSuccess(res, {
      data: result.data,
      pagination: result.pagination,
      message: 'Employees retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get an employee by ID in the current organization.
 * GET /api/v1/employees/:id
 */
export const getEmployeeById = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const employee = await employeeService.getEmployeeById(req.params.id, tenantId);

    sendSuccess(res, {
      data: employee,
      message: 'Employee retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
