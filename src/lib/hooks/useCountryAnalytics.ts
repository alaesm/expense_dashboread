'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

// Types
interface CountryAnalytics {
  countryCode: string;
  count: number;
}

interface UseCountryAnalyticsResult {
  countryAnalytics: CountryAnalytics[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCountryAnalytics: (limit?: number) => Promise<void>;
  refreshCountryAnalytics: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  COUNTRY_ANALYTICS: '/users/analytics/country-codes',
};

export function useCountryAnalytics(): UseCountryAnalyticsResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [countryAnalytics, setCountryAnalytics] = useState<CountryAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch country analytics
  const fetchCountryAnalytics = useCallback(async (limit?: number) => {
    setIsLoading(true);
    clearError();

    try {
      let endpoint = ENDPOINTS.COUNTRY_ANALYTICS;
      
      // Add limit parameter if provided
      if (limit !== undefined) {
        endpoint += `?limit=${limit}`;
      }

      const response = await api.get<CountryAnalytics[]>(endpoint);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch country analytics');
      }

      setCountryAnalytics(response.data || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch country analytics';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Refresh country analytics
  const refreshCountryAnalytics = useCallback(async () => {
    await fetchCountryAnalytics();
  }, [fetchCountryAnalytics]);

  return {
    countryAnalytics,
    isLoading,
    error,
    
    // Actions
    fetchCountryAnalytics,
    refreshCountryAnalytics,
    clearError,
  };
}
