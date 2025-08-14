// Font utility classes and types for our custom Primary font

export const FontWeights = {
  EXTRA_LIGHT: 'font-primary-extra-light',
  LIGHT: 'font-primary-light', 
  REGULAR: 'font-primary-regular',
  MEDIUM: 'font-primary-medium',
  SEMI_BOLD: 'font-primary-semi-bold',
  BOLD: 'font-primary-bold',
} as const;

export const FontClasses = {
  // Tailwind classes for primary font
  extraLight: 'font-primary font-extra-light',
  light: 'font-primary font-light',
  regular: 'font-primary font-regular',
  medium: 'font-primary font-medium', 
  semiBold: 'font-primary font-semi-bold',
  bold: 'font-primary font-bold',
} as const;

// Font utility functions
export const getFontClass = (weight: keyof typeof FontWeights): string => {
  return FontWeights[weight];
};

// Text size combinations with our custom font
export const TextStyles = {
  // Headings
  h1: 'font-primary-bold text-4xl md:text-5xl lg:text-6xl',
  h2: 'font-primary-bold text-3xl md:text-4xl lg:text-5xl',
  h3: 'font-primary-semi-bold text-2xl md:text-3xl lg:text-4xl',
  h4: 'font-primary-semi-bold text-xl md:text-2xl lg:text-3xl',
  h5: 'font-primary-medium text-lg md:text-xl lg:text-2xl',
  h6: 'font-primary-medium text-base md:text-lg lg:text-xl',
  
  // Body text
  bodyLarge: 'font-primary-regular text-lg',
  body: 'font-primary-regular text-base',
  bodySmall: 'font-primary-regular text-sm',
  
  // UI elements
  buttonLarge: 'font-primary-semi-bold text-lg',
  button: 'font-primary-medium text-base',
  buttonSmall: 'font-primary-medium text-sm',
  
  // Labels and captions
  label: 'font-primary-medium text-sm',
  caption: 'font-primary-regular text-xs',
  overline: 'font-primary-medium text-xs uppercase tracking-wider',
} as const;

// Type definitions
export type FontWeight = keyof typeof FontWeights;
export type FontClass = keyof typeof FontClasses;
export type TextStyle = keyof typeof TextStyles;

// Helper function to get text style
export const getTextStyle = (style: TextStyle): string => {
  return TextStyles[style];
};

// Helper function to combine font weight with size
export const combineTextStyles = (weight: FontWeight, additionalClasses?: string): string => {
  const baseClass = FontWeights[weight];
  return additionalClasses ? `${baseClass} ${additionalClasses}` : baseClass;
};
