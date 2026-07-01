import { createContext, useContext, useMemo, useState, ReactNode, useCallback } from 'react';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

import { createTheme, defaultTheme } from './createTheme';
import { createGlobalStyles, GlobalStyles } from './globalStyles';
import { Theme, ThemeMode } from './types';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  globalStyles: GlobalStyles;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  fontsLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'dark' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  const theme = useMemo(() => createTheme(mode), [mode]);
  const globalStyles = useMemo(() => createGlobalStyles(theme), [theme]);

  const setMode = useCallback((next: ThemeMode) => setModeState(next), []);
  const toggleMode = useCallback(
    () => setModeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
    []
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: fontsLoaded ? theme : defaultTheme,
      mode,
      isDark: mode === 'dark',
      globalStyles,
      setMode,
      toggleMode,
      fontsLoaded,
    }),
    [theme, mode, globalStyles, setMode, toggleMode, fontsLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}

export { ThemeContext };
