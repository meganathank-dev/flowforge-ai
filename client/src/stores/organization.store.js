import { create } from 'zustand';
import * as organizationService from '../services/organization.service.js';

export const useOrganizationStore = create((set) => ({
  organization: null,
  isLoading: false,
  error: null,

  fetchCurrentOrganization: async () => {
    set({ isLoading: true, error: null });
    try {
      const org = await organizationService.getCurrentOrganization();
      set({ organization: org, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch organization',
        isLoading: false
      });
    }
  },

  clearOrganization: () => {
    set({ organization: null, error: null });
  },
}));
