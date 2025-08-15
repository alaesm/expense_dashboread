'use client';

import { toast } from 'sonner';
import { useCallback } from 'react';
import type { MouseEvent } from 'react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// Toast options for creating new toasts
export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number; // in milliseconds
  action?: {
    label: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  cancel?: {
    label: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  id?: string | number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

// Promise toast options
export interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
  duration?: number;
  description?: string;
}

// Hook return type
export interface UseToastReturn {
  // Basic toast actions
  showToast: (message: string, options?: Partial<ToastOptions>) => string | number;
  showSuccess: (message: string, options?: Partial<ToastOptions>) => string | number;
  showError: (message: string, options?: Partial<ToastOptions>) => string | number;
  showWarning: (message: string, options?: Partial<ToastOptions>) => string | number;
  showInfo: (message: string, options?: Partial<ToastOptions>) => string | number;
  showLoading: (message: string, options?: Partial<ToastOptions>) => string | number;
  
  // Advanced toast actions
  showPromise: <T>(promise: Promise<T>, options: PromiseToastOptions<T>) => void;
  showCustom: (jsx: (id: string | number) => React.ReactElement, options?: Partial<ToastOptions>) => string | number;
  
  // Management actions
  dismissToast: (id: string | number) => void;
  dismissAll: () => void;
  
  // Utility functions
  getHistory: () => unknown[];
  
  // Quick notification methods
  notifySuccess: (title: string, description?: string) => void;
  notifyError: (title: string, description?: string) => void;
  notifyWarning: (title: string, description?: string) => void;
  notifyInfo: (title: string, description?: string) => void;
}

// Default duration for each toast type (in milliseconds)
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: Infinity, // Loading toasts persist until dismissed
};

export function useToast(): UseToastReturn {
  
  // Basic toast with custom options
  const showToast = useCallback((message: string, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.info;
    
    return toast(message, {
      description: options.description,
      duration: duration === Infinity ? Infinity : duration,
      action: options.action,
      cancel: options.cancel?.onClick ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : options.cancel?.label,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Success toast
  const showSuccess = useCallback((message: string, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.success;
    
    return toast.success(message, {
      description: options.description,
      duration: duration === Infinity ? Infinity : duration,
      action: options.action,
      cancel: options.cancel?.onClick ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : options.cancel?.label,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Error toast
  const showError = useCallback((message: string, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.error;
    
    return toast.error(message, {
      description: options.description,
      duration: duration === Infinity ? Infinity : duration,
      action: options.action,
      cancel: options.cancel?.onClick ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : options.cancel?.label,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Warning toast
  const showWarning = useCallback((message: string, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.warning;
    
    return toast.warning(message, {
      description: options.description,
      duration: duration === Infinity ? Infinity : duration,
      action: options.action,
      cancel: options.cancel?.onClick ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : options.cancel?.label,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Info toast
  const showInfo = useCallback((message: string, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.info;
    
    return toast.info(message, {
      description: options.description,
      duration: duration === Infinity ? Infinity : duration,
      action: options.action,
      cancel: options.cancel?.onClick ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : options.cancel?.label,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Loading toast
  const showLoading = useCallback((message: string, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.loading;
    
    return toast.loading(message, {
      description: options.description,
      duration: duration === Infinity ? Infinity : duration,
      action: options.action,
      cancel: options.cancel?.onClick ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : options.cancel?.label,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Promise toast for async operations
  const showPromise = useCallback(<T,>(promise: Promise<T>, options: PromiseToastOptions<T>): void => {
    toast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
      duration: options.duration,
      description: options.description,
    });
  }, []);

  // Custom toast with JSX content
  const showCustom = useCallback((jsx: (id: string | number) => React.ReactElement, options: Partial<ToastOptions> = {}): string | number => {
    const duration = options.duration || DEFAULT_DURATIONS.info;
    
    return toast.custom(jsx, {
      duration: duration === Infinity ? Infinity : duration,
      id: options.id,
      position: options.position,
    });
  }, []);

  // Dismiss specific toast
  const dismissToast = useCallback((id: string | number) => {
    toast.dismiss(id);
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Get toast history
  const getHistory = useCallback(() => {
    return toast.getHistory();
  }, []);

  // Quick notification methods with predefined styling
  const notifySuccess = useCallback((title: string, description?: string) => {
    showSuccess(title, {
      description,
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  }, [showSuccess]);

  const notifyError = useCallback((title: string, description?: string) => {
    showError(title, {
      description,
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  }, [showError]);

  const notifyWarning = useCallback((title: string, description?: string) => {
    showWarning(title, {
      description,
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  }, [showWarning]);

  const notifyInfo = useCallback((title: string, description?: string) => {
    showInfo(title, {
      description,
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  }, [showInfo]);

  return {
    // Basic toast actions
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    
    // Advanced toast actions
    showPromise,
    showCustom,
    
    // Management actions
    dismissToast,
    dismissAll,
    
    // Utility functions
    getHistory,
    
    // Quick notification methods
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
}
