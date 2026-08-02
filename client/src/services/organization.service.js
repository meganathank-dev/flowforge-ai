import { apiClient } from '../lib/api.client.js';

export const getCurrentOrganization = async () => {
  const response = await apiClient.get('/organizations/current');
  return response.data.data;
};
