import { getDBStatus } from '../config/db.config.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Health check controller.
 * GET /api/v1/health
 *
 * Returns server status, uptime, timestamp, and database connection state.
 * Does not expose secrets or internal configuration.
 */
export const getHealth = (_req, res) => {
  sendSuccess(res, {
    message: 'Server is healthy',
    data: {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: getDBStatus(),
    },
  });
};
