import { useEffect } from 'react';
import { useHealthStore } from '../stores/health.store.js';

/**
 * Custom hook for health check functionality.
 * Automatically fetches health status on mount.
 *
 * @returns {{ status: string|null, data: object|null, error: string|null, isLoading: boolean, refetch: Function }}
 */
export const useHealthCheck = () => {
  const { status, data, error, isLoading, fetchHealth } = useHealthStore();

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return { status, data, error, isLoading, refetch: fetchHealth };
};
