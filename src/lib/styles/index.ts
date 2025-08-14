// Export all style utilities
export * from './fonts';

// Common style combinations
export const CommonStyles = {
  // Card styles
  card: 'bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-gray-100',
  cardHeader: 'p-6 pb-4',
  cardContent: 'p-6 pt-0',
  
  // Button styles
  primaryButton: 'bg-primary-gradient text-white font-primary-semi-bold rounded-2xl px-6 py-3 shadow-primary-inset hover:shadow-primary-hover transition-all duration-300',
  secondaryButton: 'bg-white text-gray-700 font-primary-medium rounded-xl px-5 py-2.5 border border-gray-200 hover:bg-gray-50 transition-colors',
  
  // Input styles
  input: 'font-primary-regular border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors',
  
  // Layout styles
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 lg:py-16',
  
  // Background styles
  mainBackground: 'bg-main-gradient min-h-screen',
  glassBackground: 'bg-white/10 backdrop-blur-lg border border-white/20',
} as const;

export type CommonStyle = keyof typeof CommonStyles;

export const getCommonStyle = (style: CommonStyle): string => {
  return CommonStyles[style];
};
