import { radius, shadows, spacing } from '../tokens';
import { createDarkTheme } from './darkTheme';
import { createLightTheme } from './lightTheme';
import { Theme, ThemeMode } from './types';

export function createTheme(mode: ThemeMode = 'dark'): Theme {
  const base = mode === 'dark' ? createDarkTheme() : createLightTheme();

  return {
    ...base,
    spacing,
    radius,
    shadows,
  };
}

export const darkTheme = createTheme('dark');
export const lightTheme = createTheme('light');

export const defaultTheme = darkTheme;
