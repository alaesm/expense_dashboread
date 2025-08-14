// Application constants
// Example: export const API_ENDPOINTS = { ... };
// Example: export const ROUTES = { ... };
// Example: export const STORAGE_KEYS = { ... };

export const APP_CONFIG = {
  name: 'Deni Dashboard',
  version: '1.0.0',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  PROFILE: '/profile',
} as const;
