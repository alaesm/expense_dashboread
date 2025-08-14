// Error handling utilities

export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

// Custom error class
export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// Error handling utility functions
export const errorHandler = {
  // Handle API errors
  handleApiError: (error: unknown): AppError => {
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.code,
        status: error.status,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  },

  // Handle network errors
  handleNetworkError: (error: unknown): AppError => {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Network error: Unable to connect to server',
        code: 'NETWORK_ERROR',
      };
    }

    return errorHandler.handleApiError(error);
  },

  // Handle authentication errors
  handleAuthError: (error: unknown): AppError => {
    const appError = errorHandler.handleApiError(error);
    
    if (appError.status === 401 || appError.status === 403) {
      return {
        message: 'Authentication failed. Please login again.',
        code: 'AUTH_ERROR',
        status: appError.status,
      };
    }

    return appError;
  },

  // Get user-friendly error message
  getUserMessage: (error: AppError): string => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to server. Please check your internet connection.';
      case 'AUTH_ERROR':
        return 'Session expired. Please login again.';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'SERVER_ERROR':
        return 'Server error. Please try again later.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  },
};
