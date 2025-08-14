'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

// Types
interface CountryAnalytics {
  countryCode: string;
  count: number;
}

interface CurrencyAnalytics {
  currencyCode: string;
  count: number;
}

interface UserAnalytics {
  totalUsers: number;
  topCountryCodes: CountryAnalytics[];
  topCurrencyCodes: CurrencyAnalytics[];
}

interface UseUserAnalyticsResult {
  analytics: UserAnalytics | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAnalytics: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  USER_ANALYTICS: '/users/analytics',
  COUNTRY_ANALYTICS: '/users/analytics/country-codes',
  CURRENCY_ANALYTICS: '/users/analytics/currency-codes',
};

export function useUserAnalytics(): UseUserAnalyticsResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.get<UserAnalytics>(ENDPOINTS.USER_ANALYTICS);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch analytics');
      }

      setAnalytics(response.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Refresh analytics
  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    
    // Actions
    fetchAnalytics,
    refreshAnalytics,
    clearError,
  };
}
