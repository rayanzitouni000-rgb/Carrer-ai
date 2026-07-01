import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme, useGlobalStyles } from '../../theme';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { PressableScale } from '../primitives/PressableScale';

interface ScreenContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  scrollable?: boolean;
  headerRight?: ReactNode;
  contentStyle?: ViewStyle;
  safeAreaBottom?: boolean;
  variant?: 'primary' | 'secondary';
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function ScreenContainer({
  children,
  title,
  subtitle,
  showBack = false,
  scrollable = true,
  headerRight,
  contentStyle,
  safeAreaBottom = true,
  variant = 'primary',
  onScrollBeginDrag,
}: ScreenContainerProps) {
  const theme = useTheme();
  const globalStyles = useGlobalStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const bgColor =
    variant === 'primary'
      ? theme.colors.background.primary
      : theme.colors.background.secondary;

  const header = (title || showBack || headerRight) && (
    <View style={[styles.header, { paddingHorizontal: theme.spacing['4'] }]}>
      <View style={styles.headerLeft}>
        {showBack && (
          <PressableScale onPress={() => router.back()} scale={0.92}>
            <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
        )}
        <View style={styles.headerText}>
          {title && (
            <Text variant="h3" color={theme.colors.text.primary}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {headerRight}
    </View>
  );

  const contentPadding = {
    paddingHorizontal: theme.spacing['4'],
    paddingBottom: theme.spacing['8'],
    gap: theme.spacing['4'],
  };

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={[contentPadding, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onScrollBeginDrag={onScrollBeginDrag}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[globalStyles.screen, contentPadding, { flex: 1 }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[
        globalStyles.screen,
        {
          backgroundColor: bgColor,
          paddingTop: insets.top,
          paddingBottom: safeAreaBottom ? insets.bottom : 0,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {header}
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
});
