// Master theme for ÉmoSanté – AI-Powered Emotion & Sentiment Journal

const colors = {
  // Core brand
  primary: '#C8A2C8', // Lilac
  primaryLight: '#E3CBE3',
  primaryDark: '#A77EA7',

  // Backgrounds & surfaces
  background: '#F5EEDF', // Soft beige
  surface: '#FFFFFF',
  surfaceSoft: '#FDF8F0',

  // Neutrals
  text: '#333333',
  textMuted: '#666666',
  textMutedSoft: '#999999',
  borderSoft: '#E2D4C8',

  // Secondary lilac tones
  secondary: '#B58FB5',
  secondaryLight: '#EBD9EB',
  secondaryDark: '#8C6A8C',

  // Semantic
  textOnPrimary: '#FFFFFF',
  danger: '#F7A8A8', // soft pastel red
  dangerText: '#8A1F1F',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

const radii = {
  sm: 12,
  md: 20,
  lg: 24,
  xl: 30,
  full: 999,
};

const typography = {
  // Use a rounded, modern font if you add it later (e.g. Poppins / Nunito / Inter).
  // For now we rely on the system font so the app runs without custom font setup.
  fontFamilyPrimary: 'System',
  sizes: {
    largeTitle: 32,
    title: 24,
    subtitle: 16,
    body: 14,
    caption: 12,
  },
};

const shadows = {
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  softer: {
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
};

export default {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};
