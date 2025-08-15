'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useErrorHandling } from './useErrorHandling';
import { useToast } from './useToast';

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
  const { showSuccess, showError } = useToast();
  
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

      // Show success toast
      showSuccess('Admin created successfully!', {
        description: `${response.data.name} (${response.data.email}) has been added as ${response.data.role}`,
        action: {
          label: 'View Admin',
          onClick: () => console.log('View admin:', response.data?.id),
        }
      });

      // Refresh the list
      await fetchAdmins();
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create admin';
      setError(errorMessage);
      
      // Show error toast
      showError('Failed to create admin', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => void createAdmin(data),
        }
      });
      
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, fetchAdmins, showSuccess, showError]);

  // Update admin
  const updateAdmin = useCallback(async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await api.put<Admin>(ENDPOINTS.ADMIN_BY_ID(id), data);
      
      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || response.error || 'Failed to update admin');
      }

      // Show success toast
      showSuccess('Admin updated successfully!', {
        description: `${response.data.name}'s account has been updated`,
        action: {
          label: 'View Changes',
          onClick: () => console.log('View admin changes:', response.data?.id),
        }
      });

      // Refresh the list
      await fetchAdmins();
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update admin';
      setError(errorMessage);
      
      // Show error toast
      showError('Failed to update admin', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => void updateAdmin(id, data),
        }
      });
      
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, fetchAdmins, showSuccess, showError]);

  // Delete admin
  const deleteAdmin = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    clearError();

    try {
      // Get admin details before deletion for the success message
      const adminToDelete = admins.find(admin => admin.id === id);
      
      const response = await api.delete(ENDPOINTS.ADMIN_BY_ID(id));
      
      if (response.status !== "success") {
        throw new Error(response.message || response.error || 'Failed to delete admin');
      }

      // Show success toast with admin details
      const adminName = adminToDelete?.name || 'Admin';
      const adminEmail = adminToDelete?.email || '';
      const adminRole = adminToDelete?.role || 'admin';
      
      showSuccess('Admin deleted successfully!', {
        description: `Admin account "${adminName}" (${adminEmail}) with role "${adminRole}" has been deleted`,
        action: {
          label: 'View Logs',
          onClick: () => console.log('View deletion logs for admin:', id),
        }
      });

      // Refresh the list to reflect changes
      await fetchAdmins();

    } catch (err) {
      let errorMessage = 'Failed to delete admin';
      
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('Cannot delete your own account')) {
          errorMessage = 'Cannot delete your own account';
          showError('Self-deletion prevented', {
            description: 'You cannot delete your own admin account for security reasons',
          });
        } else if (err.message.includes('Only super admin can delete')) {
          errorMessage = 'Only super admin can delete admin accounts';
          showError('Insufficient permissions', {
            description: 'Only super administrators can delete admin accounts',
          });
        } else if (err.message.includes('Admin not found')) {
          errorMessage = 'Admin not found';
          showError('Admin not found', {
            description: 'The admin account you are trying to delete no longer exists',
          });
        } else {
          errorMessage = err.message;
          showError('Failed to delete admin', {
            description: errorMessage,
            action: {
              label: 'Retry',
              onClick: () => void deleteAdmin(id),
            }
          });
        }
      } else {
        showError('Failed to delete admin', {
          description: errorMessage,
          action: {
            label: 'Retry',
            onClick: () => void deleteAdmin(id),
          }
        });
      }
      
      setError(errorMessage);
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, fetchAdmins, admins, showSuccess, showError]);

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
  const { showSuccess, showError } = useToast();
  
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
      
      // Show error toast for profile fetch failures
      showError('Failed to load profile', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => void fetchProfile(),
        }
      });
      
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, showError]);

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
      
      // Show success toast
      showSuccess('Profile updated successfully!', {
        description: `Your profile information has been updated`,
        action: {
          label: 'View Profile',
          onClick: () => console.log('View profile:', response.data?.id),
        }
      });
      
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      
      // Show error toast
      showError('Failed to update profile', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => void updateProfile(data),
        }
      });
      
      handleApiError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleApiError, showSuccess, showError]);

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
