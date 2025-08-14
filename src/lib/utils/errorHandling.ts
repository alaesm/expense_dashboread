// Error handling utilities for API responses
import type { ApiError } from '@/apiclient/types/admin';

export class ApiErrorHandler {
  static handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as ApiError).message;
    }
    
    return 'An unexpected error occurred';
  }

  static isApiError(error: unknown): error is ApiError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'status' in error &&
      'message' in error &&
      (error as ApiError).status === 'error'
    );
  }

  static getErrorMessage(error: unknown): string {
    if (this.isApiError(error)) {
      if (error.errors && error.errors.length > 0) {
        return error.errors.join(', ');
      }
      return error.message;
    }
    
    return this.handleError(error);
  }

  static isAuthError(error: unknown): boolean {
    if (this.isApiError(error)) {
      return error.statusCode === 401 || error.statusCode === 403;
    }
    
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('unauthorized') || 
             message.includes('forbidden') ||
             message.includes('token') ||
             message.includes('authentication');
    }
    
    return false;
  }

  static isValidationError(error: unknown): boolean {
    if (this.isApiError(error)) {
      return error.statusCode === 400 && !!(error.errors && error.errors.length > 0);
    }
    
    return false;
  }

  static getValidationErrors(error: unknown): string[] {
    if (this.isApiError(error) && error.errors) {
      return error.errors;
    }
    
    return [];
  }
}

// Toast notification utility (can be replaced with your preferred toast library)
export class NotificationService {
  static success(message: string) {
    console.log('Success:', message);
    // Replace with your toast implementation
    // toast.success(message);
  }

  static error(message: string) {
    console.error('Error:', message);
    // Replace with your toast implementation
    // toast.error(message);
  }

  static warning(message: string) {
    console.warn('Warning:', message);
    // Replace with your toast implementation
    // toast.warning(message);
  }

  static info(message: string) {
    console.info('Info:', message);
    // Replace with your toast implementation
    // toast.info(message);
  }
}

// Async operation wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    showSuccess?: boolean;
    successMessage?: string;
    showError?: boolean;
    onError?: (error: unknown) => void;
  }
): Promise<T | null> {
  try {
    const result = await operation();
    
    if (options?.showSuccess && options.successMessage) {
      NotificationService.success(options.successMessage);
    }
    
    return result;
  } catch (error) {
    const errorMessage = ApiErrorHandler.getErrorMessage(error);
    
    if (options?.showError !== false) {
      NotificationService.error(errorMessage);
    }
    
    if (options?.onError) {
      options.onError(error);
    }
    
    throw error;
  }
}

// Validation helper for forms
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  if (password !== confirmation) {
    return 'Passwords do not match';
  }
  return null;
}
