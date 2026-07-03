import { DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { GlobalFloatingAI } from '@/components/layout/GlobalFloatingAI';
import {
  ThemeProvider,
  ToastProvider,
  useTheme,
  useThemeMode,
} from '@/design-system';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const theme = useTheme();
  const { isDark } = useThemeMode();

  const navigationTheme = useMemo(
    () => ({
      ...DarkTheme,
      dark: isDark,
      colors: {
        ...DarkTheme.colors,
        primary: theme.colors.brand.primary,
        background: theme.colors.background.primary,
        card: theme.colors.card.default,
        text: theme.colors.text.primary,
        border: theme.colors.border.default,
        notification: theme.colors.brand.accent,
      },
    }),
    [theme, isDark]
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="career-onboarding" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="goal-selection" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cv-analyzer" options={{ presentation: 'card' }} />
        <Stack.Screen name="cv-manager/generate/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="cv-manager/generate/form" options={{ presentation: 'card' }} />
        <Stack.Screen name="cv-manager/generate/preview" options={{ presentation: 'card' }} />
        <Stack.Screen name="ai-chat" options={{ presentation: 'modal' }} />
        <Stack.Screen name="interview" options={{ presentation: 'card' }} />
        <Stack.Screen name="cover-letter/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="cover-letter/template" options={{ presentation: 'card' }} />
        <Stack.Screen name="cover-letter/generate" options={{ presentation: 'card' }} />
        <Stack.Screen name="cover-letter/preview" options={{ presentation: 'card' }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider initialMode="dark">
          <ToastProvider>
            <RootNavigator />
            <GlobalFloatingAI />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
