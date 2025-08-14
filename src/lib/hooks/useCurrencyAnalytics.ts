'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

// Types
interface CurrencyAnalytics {
  currencyCode: string;
  count: number;
}

interface UseCurrencyAnalyticsResult {
  currencyAnalytics: CurrencyAnalytics[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCurrencyAnalytics: (limit?: number) => Promise<void>;
  refreshCurrencyAnalytics: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  CURRENCY_ANALYTICS: '/users/analytics/currency-codes',
};

export function useCurrencyAnalytics(): UseCurrencyAnalyticsResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [currencyAnalytics, setCurrencyAnalytics] = useState<CurrencyAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch currency analytics
  const fetchCurrencyAnalytics = useCallback(async (limit?: number) => {
    setIsLoading(true);
    clearError();

    try {
      let endpoint = ENDPOINTS.CURRENCY_ANALYTICS;
      
      // Add limit parameter if provided
      if (limit !== undefined) {
        endpoint += `?limit=${limit}`;
      }

      const response = await api.get<CurrencyAnalytics[]>(endpoint);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch currency analytics');
      }

      setCurrencyAnalytics(response.data || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch currency analytics';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Refresh currency analytics
  const refreshCurrencyAnalytics = useCallback(async () => {
    await fetchCurrencyAnalytics();
  }, [fetchCurrencyAnalytics]);

  return {
    currencyAnalytics,
    isLoading,
    error,
    
    // Actions
    fetchCurrencyAnalytics,
    refreshCurrencyAnalytics,
    clearError,
  };
}
