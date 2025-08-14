// Utility functions
export * from './errorHandling';

// Common utility function for combining classes (from shadcn/ui)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
