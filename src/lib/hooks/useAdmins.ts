'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';

// Types
interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin: string | null;
}

interface CreateAdminRequest {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface UpdateAdminRequest {
  name?: string;
  isActive?: boolean;
  role?: 'admin' | 'super_admin';
}

interface UpdateProfileRequest {
  name?: string;
  password?: string;
}

interface UseAdminsResult {
  admins: Admin[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAdmins: () => Promise<void>;
  createAdmin: (data: CreateAdminRequest) => Promise<Admin>;
  updateAdmin: (id: string, data: UpdateAdminRequest) => Promise<Admin>;
  deleteAdmin: (id: string) => Promise<void>;
  refreshAdmins: () => Promise<void>;
  clearError: () => void;
}

interface UseAdminProfileResult {
  profile: Admin | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<Admin>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

// API Endpoints
const ENDPOINTS = {
  ADMINS: '/admin',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_BY_ID: (id: string) => `/admin/${id}`,
};

export function useAdmins(): UseAdminsResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch admins
  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.get<Admin[]>(ENDPOINTS.ADMINS);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch admins');
      }

      setAdmins(response.data || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admins';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Create admin
  const createAdmin = useCallback(async (data: CreateAdminRequest): Promise<Admin> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.post<Admin>(ENDPOINTS.ADMINS, data);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to create admin');
      }

      // Refresh the list
      await fetchAdmins();
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create admin';
      setError(errorMessage);
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, fetchAdmins]);

  // Update admin
  const updateAdmin = useCallback(async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.put<Admin>(ENDPOINTS.ADMIN_BY_ID(id), data);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to update admin');
      }

      // Refresh the list
      await fetchAdmins();
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update admin';
      setError(errorMessage);
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, fetchAdmins]);

  // Delete admin
  const deleteAdmin = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.delete(ENDPOINTS.ADMIN_BY_ID(id));
      
      if (response.status !== "success") {
        throw new Error(response.message || response.error || 'Failed to delete admin');
      }

      // Refresh the list
      await fetchAdmins();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete admin';
      setError(errorMessage);
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, fetchAdmins]);

  // Refresh admins
  const refreshAdmins = useCallback(async () => {
    await fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    isLoading,
    error,
    
    // Actions
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    refreshAdmins,
    clearError,
  };
}

export function useAdminProfile(): UseAdminProfileResult {
  const { handleApiError, clearError: clearApiError } = useErrorHandling();
  
  // State
  const [profile, setProfile] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearApiError();
  }, [clearApiError]);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.get<Admin>(ENDPOINTS.ADMIN_PROFILE);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to fetch profile');
      }

      setProfile(response.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<Admin> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.put<Admin>(ENDPOINTS.ADMIN_PROFILE, data);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to update profile');
      }

      setProfile(response.data);
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    
    // Actions
    fetchProfile,
    updateProfile,
    refreshProfile,
    clearError,
  };
}
