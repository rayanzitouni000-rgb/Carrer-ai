/** Raw color primitives — never use directly in components. Use theme.colors instead. */

export const palette = {
  // Neutrals — Dark
  ink950: '#0A0F1E',
  ink900: '#0D1424',
  ink850: '#111827',
  ink800: '#16161D',
  ink750: '#1C1C26',
  ink700: '#252530',
  ink600: '#32323E',
  ink500: '#52525B',
  ink400: '#71717A',
  ink300: '#A1A1AA',
  ink200: '#D4D4D8',
  ink100: '#F4F4F5',
  ink50: '#FAFAFA',
  white: '#FFFFFF',
  black: '#000000',

  // Brand — bleu coach (cohérent avatar utilisateur)
  blue500: '#2B6CFF',
  blue600: '#1D4ED8',
  blue400: '#60A5FA',
  blueGlow: '#2E6BFF',
  navyBg: '#0A0F1E',
  indigo500: '#1D4ED8',
  cyan400: '#22D3EE',
  cyan500: '#06B6D4',

  // Status
  emerald400: '#34D399',
  emerald500: '#10B981',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  rose400: '#F87171',
  rose500: '#EF4444',
  pink500: '#EC4899',

  // Premium gold
  gold400: '#FBBF24',
  gold500: '#F59E0B',
} as const;

export const gradients = {
  brand: ['#1D4ED8', '#2B6CFF', '#60A5FA'] as const,
  brandSoft: ['#0A0F1E', '#1D4ED8', '#2B6CFF'] as const,
  ai: ['#1D4ED8', '#2B6CFF', '#2E6BFF'] as const,
  premium: ['#F59E0B', '#EF4444', '#EC4899'] as const,
  premiumGold: ['#FBBF24', '#F59E0B', '#EF4444'] as const,
  surface: ['#0A0F1E', '#111827'] as const,
  glow: ['rgba(43,108,255,0.35)', 'rgba(46,107,255,0.12)', 'transparent'] as const,
  glass: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)'] as const,
} as const;

export type GradientKey = keyof typeof gradients;
