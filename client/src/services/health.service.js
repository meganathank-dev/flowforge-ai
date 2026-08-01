import apiClient from './api.client.js';

/**
 * Check backend health status.
 * @returns {Promise<object>} Health check response data
 */
export const checkHealth = async () => {
  return apiClient.get('/health');
};
