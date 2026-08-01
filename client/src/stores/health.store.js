import { create } from 'zustand';
import { checkHealth } from '../services/health.service.js';

/**
 * Zustand store for backend health check state.
 */
export const useHealthStore = create((set) => ({
  status: null,
  data: null,
  error: null,
  isLoading: false,

  fetchHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await checkHealth();
      set({
        status: 'connected',
        data: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        status: 'disconnected',
        error: error.message || 'Failed to connect to backend',
        isLoading: false,
      });
    }
  },
}));
