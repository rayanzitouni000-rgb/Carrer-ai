export const radius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;
