'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';
import { useToast } from './useToast';

// Types
interface LoginResponse {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    updatedAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    lastLogin: {
      _seconds: number;
      _nanoseconds: number;
    };
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

interface UseLoginResult {
  // Form state
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRememberMe: (remember: boolean) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  LOGIN: '/admin/login',
  LOGOUT: '/admin/logout',
  REFRESH: '/admin/refresh',
};

export function useLogin(): UseLoginResult {
  const router = useRouter();
  const { handleAuthError, clearError: clearApiError } = useErrorHandling();
  const { showSuccess, showError, showWarning } = useToast();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Validation helper
  const validateCredentials = useCallback(() => {
    if (!email.trim()) {
      showWarning('Email required', {
        description: 'Please enter your email address to continue',
      });
      setError('Email is required');
      return false;
    }
    
    if (!password.trim()) {
      showWarning('Password required', {
        description: 'Please enter your password to continue',
      });
      setError('Password is required');
      return false;
    }
    
    if (!isValidEmail(email)) {
      showWarning('Invalid email format', {
        description: 'Please enter a valid email address',
      });
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  }, [email, password, showWarning]);

  // Login handler
  const performLogin = useCallback(async () => {
    const response = await api.post<LoginResponse>(ENDPOINTS.LOGIN, {
      email: email.trim(),
      password: password.trim(),
    });
    
    if (response.status !== "success" || !response.data) {
      throw new Error(response.message || response.error || 'Login failed');
    }

    return response.data;
  }, [email, password]);

  // Storage handler
  const handleSuccessfulLogin = useCallback((admin: LoginResponse['admin'], token: string, refreshToken?: string) => {
    api.setToken(token);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(admin));
      
      // Save refresh token if provided
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('lastEmail', email.trim());
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('lastEmail');
      }
    }

    // Show success toast
    showSuccess('Login successful!', {
      description: `Welcome back, ${admin.name}! Redirecting to dashboard...`,
      action: {
        label: 'Go to Dashboard',
        onClick: () => router.push('/dashboard'),
      }
    });
  }, [email, rememberMe, showSuccess, router]);

  // Error handler
  const handleLoginError = useCallback((err: unknown) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let errorDescription = '';

    if (err instanceof Error) {
      if (err.message.includes('fetch') || err.message.includes('network')) {
        errorMessage = 'Connection failed';
        errorDescription = 'Unable to connect to server. Please check your internet connection and try again.';
        setError('Unable to connect to server. Please check your connection.');
      } else if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid credentials';
        errorDescription = 'The email or password you entered is incorrect. Please double-check your credentials and try again.';
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('400') || err.message.includes('Bad Request')) {
        errorMessage = 'Invalid request';
        errorDescription = 'Please check your login credentials and try again.';
        setError('Please check your login credentials.');
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        errorMessage = 'Account access denied';
        errorDescription = 'Your account may be disabled or you do not have permission to access this system.';
        setError('Access denied. Please contact your administrator.');
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        errorMessage = 'Server error';
        errorDescription = 'There is a problem with our servers. Please try again in a few minutes.';
        setError('Server error. Please try again later.');
      } else {
        errorMessage = 'Login failed';
        errorDescription = err.message || 'Please check your credentials and try again.';
        setError(err.message || 'Login failed. Please try again.');
      }
    } else {
      setError('An unexpected error occurred. Please try again.');
    }

    // Show error toast
    showError(errorMessage, {
      description: errorDescription,
      action: {
        label: 'Retry',
        onClick: () => {
          clearError();
          // Focus on email field for retry
          setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.focus();
          }, 100);
        },
      }
    });
    
    handleAuthError(err);
  }, [handleAuthError, showError, clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateCredentials()) return;

    setIsLoading(true);

    try {
      const loginData = await performLogin();
      const { admin, accessToken, refreshToken } = loginData;
      
      handleSuccessfulLogin(admin, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err) {
      handleLoginError(err);
    } finally {
      setIsLoading(false);
    }
  }, [validateCredentials, performLogin, handleSuccessfulLogin, handleLoginError, clearError, router]);

  // Load remembered email on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('lastEmail');
      const shouldRemember = localStorage.getItem('rememberMe') === 'true';
      
      if (shouldRemember && rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  return {
    // Form state
    email,
    password,
    rememberMe,
    showPassword,
    
    // UI state
    isLoading,
    error,
    
    // Actions
    setEmail,
    setPassword,
    setRememberMe,
    togglePasswordVisibility,
    handleSubmit,
    clearError,
  };
}

// Helper function for email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
