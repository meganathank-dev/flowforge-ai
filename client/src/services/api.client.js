import axios from 'axios';
import { config } from '../config/index.js';

/**
 * Pre-configured Axios instance for API communication.
 *
 * Configured with authentication interceptors for automatic
 * token refreshing on 401 responses.
 */
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── Request interceptor ──────────────────────────────────────────
apiClient.interceptors.request.use(
  (requestConfig) => {
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ── Response interceptor ─────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${config.apiBaseUrl}/auth/refresh`, {}, { withCredentials: true });
        isRefreshing = false;
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err);
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 0,
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
