import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';
import { SpacingKey } from '../../tokens';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  style?: ViewStyle;
}

export function LoadingSpinner({
  message,
  size = 'large',
  fullScreen = false,
  style,
}: LoadingSpinnerProps) {
  const theme = useTheme();

  const content = (
    <View style={[styles.content, { gap: theme.spacing['4'] }, style]}>
      <ActivityIndicator size={size} color={theme.colors.brand.primary} />
      {message && (
        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: theme.colors.background.primary }]}>
        {content}
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/** Legacy padding keys mapped to spacing scale */
export const legacyPaddingMap: Record<string, SpacingKey> = {
  xs: '2',
  sm: '3',
  md: '4',
  lg: '5',
  xl: '6',
};
