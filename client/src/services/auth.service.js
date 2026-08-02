import { apiClient } from '../lib/api.client.js';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data Registration data
   * @returns {Promise<Object>} API response
   */
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login an existing user
   * @param {Object} data Login credentials (email, password)
   * @returns {Promise<Object>} API response with safe user object
   */
  login: async (data) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  /**
   * Logout the current user
   * @returns {Promise<Object>} API response
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Refresh the current session (normally handled by interceptor)
   * @returns {Promise<Object>} API response
   */
  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  /**
   * Get the current authenticated user's profile
   * @returns {Promise<Object>} API response with safe user object
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Request a password reset OTP
   * @param {Object} data { email }
   * @returns {Promise<Object>} API response
   */
  forgotPassword: async (data) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Verify the password reset OTP
   * @param {Object} data { email, otp }
   * @returns {Promise<Object>} API response
   */
  verifyResetOtp: async (data) => {
    const response = await apiClient.post('/auth/verify-reset-otp', data);
    return response.data;
  },

  /**
   * Complete the password reset with a new password
   * @param {Object} data { email, otp, newPassword, confirmPassword }
   * @returns {Promise<Object>} API response
   */
  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Change password for an authenticated user
   * @param {Object} data { currentPassword, newPassword, confirmPassword }
   * @returns {Promise<Object>} API response
   */
  changePassword: async (data) => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },
};
