import { create } from 'zustand';
import { authService } from '../services/auth.service.js';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to determine initial session state

  /**
   * Check if a valid session exists by fetching the current user profile.
   * This relies on the HTTP-only cookie automatically being sent.
   */
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const data = await authService.getCurrentUser();

      // Expected response shape from backend: { status: 'success', data: { user: { ... } } }
      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      // 401 or network error -> not authenticated
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Log the user in and update state.
   */
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(credentials);

      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Register a new account.
   * Does not auto-login in Phase 1B/1C architecture.
   */
  register: async (registrationData) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(registrationData);
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Log the user out cleanly by calling the API to destroy the session.
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed, clearing local state anyway', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Local-only state clear, used by Axios interceptor when silent refresh fails.
   */
  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

// Listen for the custom auth:logout event dispatched by the Axios interceptor
window.addEventListener('auth:logout', () => {
  useAuthStore.getState().clearAuth();
});
