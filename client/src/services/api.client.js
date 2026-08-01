import axios from 'axios';
import { config } from '../config/index.js';

/**
 * Pre-configured Axios instance for API communication.
 *
 * Architecture is prepared for future authentication interceptors
 * (e.g., attaching access tokens, refreshing tokens on 401),
 * but NO authentication logic is implemented yet.
 */
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ── Request interceptor ──────────────────────────────────────────
apiClient.interceptors.request.use(
  (requestConfig) => {
    // Future: Attach access token from auth store
    // const token = useAuthStore.getState().accessToken;
    // if (token) {
    //   requestConfig.headers.Authorization = `Bearer ${token}`;
    // }
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
  (error) => {
    // Future: Handle 401 token refresh
    // if (error.response?.status === 401) {
    //   // Attempt token refresh
    // }

    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 0,
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
