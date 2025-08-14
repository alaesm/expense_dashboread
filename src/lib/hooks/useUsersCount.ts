'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

// Types
interface UsersCountResponse {
  totalUsers: number;
}

interface UseUsersCountResult {
  totalUsers: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsersCount: () => Promise<void>;
  refreshCount: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  USERS_COUNT: '/users/count',
};

export function useUsersCount(): UseUsersCountResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch users count
  const fetchUsersCount = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.get<UsersCountResponse>(ENDPOINTS.USERS_COUNT);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch users count');
      }

      setTotalUsers(response.data.totalUsers || 0);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users count';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Refresh count
  const refreshCount = useCallback(async () => {
    await fetchUsersCount();
  }, [fetchUsersCount]);

  return {
    totalUsers,
    isLoading,
    error,
    
    // Actions
    fetchUsersCount,
    refreshCount,
    clearError,
  };
}
