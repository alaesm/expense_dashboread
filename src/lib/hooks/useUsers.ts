'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

// Types for backend API
interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  countryCode: string;
  currencyCode: string;
  disabled: boolean;
}

interface UsersResponse {
  data: User[];
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UseUsersResult {
  users: User[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  pagination: UsersResponse['pagination'] | null;
  
  // Actions
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  refreshUsers: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints for real backend
const ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
};

export function useUsers(): UseUsersResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch users from real backend
  const fetchUsers = useCallback(async (page?: number, limit?: number) => {
    setIsLoading(true);
    clearError();

    try {
      let endpoint = ENDPOINTS.USERS;
      
      // Add pagination parameters if provided
      if (page !== undefined || limit !== undefined) {
        const params = new URLSearchParams();
        if (page !== undefined) params.append('page', page.toString());
        if (limit !== undefined) params.append('limit', limit.toString());
        endpoint += `?${params.toString()}`;
      }

      console.log('useUsers - Fetching from endpoint:', endpoint);
      const response = await api.get<UsersResponse>(endpoint);
      console.log('useUsers - API Response:', response);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch users');
      }

      // Handle response structure based on API documentation
      let usersData: User[] = [];
      let count = 0;
      let paginationData = null;

      if (Array.isArray(response.data)) {
        // Simple array response
        usersData = response.data;
        count = response.data.length;
      } else if (response.data && 'data' in response.data) {
        // Response with data wrapper
        usersData = response.data.data || [];
        count = response.data.count || response.data.data?.length || 0;
        paginationData = response.data.pagination || null;
      }

      console.log('useUsers - Setting users data:', usersData);
      console.log('useUsers - Users count:', count);
      
      setUsers(usersData);
      setTotalCount(count);
      setPagination(paginationData);

    } catch (err) {
      console.error('useUsers - Error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Refresh users
  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    totalCount,
    pagination,
    
    // Actions
    fetchUsers,
    refreshUsers,
    clearError,
  };
}