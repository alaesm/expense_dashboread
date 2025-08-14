'use client';

import { useState, useCallback } from 'react';
import { errorHandler, type AppError } from '@/lib/errorHandling';

interface UseErrorHandlingResult {
  error: AppError | null;
  isError: boolean;
  clearError: () => void;
  handleError: (error: unknown) => void;
  handleApiError: (error: unknown) => void;
  handleNetworkError: (error: unknown) => void;
  handleAuthError: (error: unknown) => void;
  getUserMessage: () => string;
}

export function useErrorHandling(): UseErrorHandlingResult {
  const [error, setError] = useState<AppError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown) => {
    const appError = errorHandler.handleApiError(err);
    setError(appError);
    console.error('Error occurred:', appError);
  }, []);

  const handleApiError = useCallback((err: unknown) => {
    const appError = errorHandler.handleApiError(err);
    setError(appError);
    console.error('API Error:', appError);
  }, []);

  const handleNetworkError = useCallback((err: unknown) => {
    const appError = errorHandler.handleNetworkError(err);
    setError(appError);
    console.error('Network Error:', appError);
  }, []);

  const handleAuthError = useCallback((err: unknown) => {
    const appError = errorHandler.handleAuthError(err);
    setError(appError);
    console.error('Auth Error:', appError);
  }, []);

  const getUserMessage = useCallback(() => {
    if (!error) return '';
    return errorHandler.getUserMessage(error);
  }, [error]);

  return {
    error,
    isError: !!error,
    clearError,
    handleError,
    handleApiError,
    handleNetworkError,
    handleAuthError,
    getUserMessage,
  };
}
