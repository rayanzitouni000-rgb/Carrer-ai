import { ViewStyle } from 'react-native';

export const shadowColor = {
  dark: '#000000',
  brand: '#2B6CFF',
  premium: '#F59E0B',
} as const;

export const shadows = {
  none: {} satisfies ViewStyle,
  xs: {
    shadowColor: shadowColor.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 1,
  } satisfies ViewStyle,
  sm: {
    shadowColor: shadowColor.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  } satisfies ViewStyle,
  md: {
    shadowColor: shadowColor.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  } satisfies ViewStyle,
  lg: {
    shadowColor: shadowColor.dark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  } satisfies ViewStyle,
  glow: {
    shadowColor: shadowColor.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  } satisfies ViewStyle,
  glowPremium: {
    shadowColor: shadowColor.premium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  } satisfies ViewStyle,
} as const;

export type ShadowKey = keyof typeof shadows;
