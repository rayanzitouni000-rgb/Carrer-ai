import { fontFamily, gradients, palette, typographyScale } from '../tokens';
import { Theme, ThemeColors } from './types';

const darkColors: ThemeColors = {
  background: {
    primary: palette.ink950,
    secondary: palette.ink900,
  },
  card: {
    default: palette.ink800,
    elevated: palette.ink750,
    glass: 'rgba(255, 255, 255, 0.06)',
  },
  border: {
    default: palette.ink700,
    subtle: 'rgba(255, 255, 255, 0.06)',
    focus: palette.blue500,
  },
  brand: {
    primary: palette.blue500,
    primaryLight: palette.blue400,
    primaryDark: palette.blue600,
    gradient: gradients.brand,
    accent: palette.violet500,
    accentLight: palette.violet400,
  },
  status: {
    success: palette.emerald400,
    successMuted: 'rgba(52, 211, 153, 0.15)',
    warning: palette.amber400,
    warningMuted: 'rgba(251, 191, 36, 0.15)',
    danger: palette.rose400,
    dangerMuted: 'rgba(248, 113, 113, 0.15)',
    info: palette.blue400,
  },
  text: {
    primary: palette.ink50,
    secondary: palette.ink300,
    muted: palette.ink400,
    inverse: palette.ink950,
    brand: palette.blue400,
  },
  overlay: 'rgba(5, 5, 8, 0.88)',
  transparent: 'transparent',
  gradients,
  tabBar: {
    background: palette.ink900,
    active: palette.blue400,
    inactive: palette.ink400,
  },
  skeleton: {
    base: palette.ink750,
    highlight: palette.ink600,
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

export function createDarkTheme(): Omit<Theme, 'spacing' | 'radius' | 'shadows'> {
  return {
    mode: 'dark',
    isDark: true,
    colors: darkColors,
    typography: buildTypography(),
  };
}

export const darkThemeBase = createDarkTheme();
