import axios from 'axios';
import { config } from '../config/index.js';

/**
 * Pre-configured Axios instance for API calls.
 * Includes interceptors for token refresh handling.
 */
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized
    // Do not retry if request has already been retried, or if it is the refresh endpoint itself
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === '/auth/refresh'
    ) {
      return Promise.reject(error);
    }

    // If another request is currently refreshing the token, add this to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Mark as retried so we don't loop
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt silent refresh via HTTP-only cookie
      await apiClient.post('/auth/refresh');

      // Token refreshed successfully, process the queued requests
      isRefreshing = false;
      processQueue(null);

      // Retry original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed (e.g., refresh token expired or invalid)
      isRefreshing = false;
      processQueue(refreshError);

      // Dispatch a custom event to notify the store/app to clear authentication state
      // This avoids a circular dependency between the API client and the Auth store
      window.dispatchEvent(new CustomEvent('auth:logout'));

      return Promise.reject(refreshError);
    }
  }
);
