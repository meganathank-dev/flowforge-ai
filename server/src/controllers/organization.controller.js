import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/response.js';
import * as organizationService from '../services/organization.service.js';
import { UnauthorizedError } from '../errors/app.error.js';

/**
 * Create a new organization.
 * POST /api/v1/organizations
 */
export const createOrganization = async (req, res, next) => {
  try {
    const org = await organizationService.createOrganization(req.body);
    sendSuccess(res, {
      data: org,
      message: 'Organization created successfully',
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current organization.
 * GET /api/v1/organizations/current
 */
export const getCurrentOrganization = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedError('User does not have an organization');
    }

    const org = await organizationService.getOrganizationById(tenantId, tenantId);

    sendSuccess(res, {
      data: org,
      message: 'Current organization retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
