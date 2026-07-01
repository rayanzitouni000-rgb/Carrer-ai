import { TextStyle, ViewStyle } from 'react-native';

import { GradientKey, ShadowKey, SpacingKey, TypographyVariant } from '../tokens';

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
  };
  card: {
    default: string;
    elevated: string;
    glass: string;
  };
  border: {
    default: string;
    subtle: string;
    focus: string;
  };
  brand: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    gradient: readonly [string, string, ...string[]];
    accent: string;
    accentLight: string;
  };
  status: {
    success: string;
    successMuted: string;
    warning: string;
    warningMuted: string;
    danger: string;
    dangerMuted: string;
    info: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    brand: string;
  };
  overlay: string;
  transparent: string;
  gradients: Record<GradientKey, readonly [string, string, ...string[]]>;
  tabBar: {
    background: string;
    active: string;
    inactive: string;
  };
  skeleton: {
    base: string;
    highlight: string;
  };
}

export interface ThemeTypography {
  hero: TextStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
  label: TextStyle;
}

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: Record<SpacingKey, number>;
  radius: Record<string, number>;
  shadows: Record<ShadowKey, ViewStyle>;
}

export type TypographyVariantKey = TypographyVariant;
