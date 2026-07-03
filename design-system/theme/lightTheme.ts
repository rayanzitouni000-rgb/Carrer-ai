import { fontFamily, gradients, palette, typographyScale } from '../tokens';
import { Theme, ThemeColors } from './types';

const lightColors: ThemeColors = {
  background: {
    primary: palette.ink50,
    secondary: palette.ink100,
  },
  card: {
    default: palette.white,
    elevated: palette.white,
    glass: 'rgba(255, 255, 255, 0.72)',
  },
  border: {
    default: palette.ink200,
    subtle: 'rgba(0, 0, 0, 0.06)',
    focus: palette.blue600,
  },
  brand: {
    primary: palette.blue600,
    primaryLight: palette.blue500,
    primaryDark: '#1D4ED8',
    gradient: gradients.brand,
    accent: palette.blueGlow,
    accentLight: palette.blue400,
  },
  status: {
    success: palette.emerald500,
    successMuted: 'rgba(16, 185, 129, 0.12)',
    warning: palette.amber500,
    warningMuted: 'rgba(245, 158, 11, 0.12)',
    danger: palette.rose500,
    dangerMuted: 'rgba(239, 68, 68, 0.12)',
    info: palette.blue600,
  },
  text: {
    primary: palette.ink900,
    secondary: palette.ink500,
    muted: palette.ink400,
    inverse: palette.ink50,
    brand: palette.blue600,
  },
  overlay: 'rgba(0, 0, 0, 0.45)',
  transparent: 'transparent',
  gradients,
  tabBar: {
    background: palette.white,
    active: palette.blue600,
    inactive: palette.ink400,
  },
  skeleton: {
    base: palette.ink200,
    highlight: palette.ink100,
  },
};

function buildTypography(): Theme['typography'] {
  return {
    hero: { ...typographyScale.hero, fontFamily: fontFamily.displayBold },
    h1: { ...typographyScale.h1, fontFamily: fontFamily.displayBold },
    h2: { ...typographyScale.h2, fontFamily: fontFamily.display },
    h3: { ...typographyScale.h3, fontFamily: fontFamily.display },
    title: { ...typographyScale.title, fontFamily: fontFamily.bodySemiBold },
    subtitle: { ...typographyScale.subtitle, fontFamily: fontFamily.bodyMedium },
    body: { ...typographyScale.body, fontFamily: fontFamily.body },
    bodySmall: { ...typographyScale.bodySmall, fontFamily: fontFamily.body },
    caption: { ...typographyScale.caption, fontFamily: fontFamily.body },
    button: { ...typographyScale.button, fontFamily: fontFamily.bodySemiBold },
    label: { ...typographyScale.label, fontFamily: fontFamily.bodyMedium },
  };
}

export function createLightTheme(): Omit<Theme, 'spacing' | 'radius' | 'shadows'> {
  return {
    mode: 'light',
    isDark: false,
    colors: lightColors,
    typography: buildTypography(),
  };
}

export const lightThemeBase = createLightTheme();
