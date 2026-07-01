import { useThemeContext } from './ThemeProvider';
import { Theme, ThemeMode } from './types';
import { GlobalStyles } from './globalStyles';

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useThemeMode(): {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
} {
  const { mode, isDark, setMode, toggleMode } = useThemeContext();
  return { mode, isDark, setMode, toggleMode };
}

export function useGlobalStyles(): GlobalStyles {
  return useThemeContext().globalStyles;
}

export function useFontsLoaded(): boolean {
  return useThemeContext().fontsLoaded;
}
