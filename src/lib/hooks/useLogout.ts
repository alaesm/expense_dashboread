'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

interface UseLogoutResult {
  isLoading: boolean;
  error: string | null;
  
  // Actions
  logout: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  LOGOUT: '/admin/logout',
};

export function useLogout(): UseLogoutResult {
  const router = useRouter();
  const { clearError: clearApiError } = useErrorHandling();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      // Get refresh token from localStorage
      let refreshToken = null;
      if (typeof window !== 'undefined') {
        refreshToken = localStorage.getItem('refreshToken');
      }

      // Call logout API with refresh token
      if (refreshToken) {
        const response = await api.post(ENDPOINTS.LOGOUT, {
          refreshToken
        });
        
        if (response.status !== "success") {
          console.warn('Logout API failed:', response.message || response.error);
          // Continue with local logout even if API fails
        }
      } else {
        console.warn('No refresh token found, skipping API logout');
      }

      // Clear local storage
      api.removeToken();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('lastEmail');
        localStorage.removeItem('refreshToken');
      }

      // Redirect to login
      router.push('/login');

    } catch (err) {
      // Even if logout API fails, clear local storage and redirect
      console.warn('Logout error:', err);
      
      api.removeToken();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('lastEmail');
        localStorage.removeItem('refreshToken');
      }

      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [clearError, router]);

  return {
    isLoading,
    error,
    
    // Actions
    logout,
    clearError,
  };
}
