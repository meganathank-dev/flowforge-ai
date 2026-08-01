import { StatusCodes } from 'http-status-codes';

/**
 * Send a successful JSON response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {*} [options.data=null] - Response payload
 * @param {string} [options.message='Success'] - Human-readable message
 * @param {number} [options.statusCode=200] - HTTP status code
 */
export const sendSuccess = (
  res,
  { data = null, message = 'Success', statusCode = StatusCodes.OK } = {},
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error JSON response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string} [options.message='An error occurred'] - Error message
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {Array} [options.errors=[]] - Detailed error list
 */
export const sendError = (
  res,
  {
    message = 'An error occurred',
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    errors = [],
  } = {},
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Send a paginated JSON response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {Array} options.data - Page of results
 * @param {string} [options.message='Success'] - Human-readable message
 * @param {object} options.pagination - Pagination metadata
 * @param {number} options.pagination.page - Current page
 * @param {number} options.pagination.limit - Items per page
 * @param {number} options.pagination.total - Total items
 * @param {number} options.pagination.pages - Total pages
 */
export const sendPaginated = (res, { data, message = 'Success', pagination }) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message,
    data,
    pagination,
  });
};
