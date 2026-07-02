import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, useTheme } from '@/design-system';

interface SessionContextBannerProps {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'assessment';
}

export function SessionContextBanner({
  title,
  subtitle,
  variant = 'default',
}: SessionContextBannerProps) {
  const theme = useTheme();

  if (variant === 'assessment') {
    return (
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.banner, { borderRadius: theme.radius.lg }]}
      >
        <Text variant="title" color="#FFFFFF">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="rgba(255,255,255,0.85)">
            {subtitle}
          </Text>
        )}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.card.elevated,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text variant="label" color={theme.colors.brand.primaryLight}>
        Préparation pour
      </Text>
      <Text variant="title" color={theme.colors.text.primary}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="caption" color={theme.colors.text.muted}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 16,
    gap: 4,
    borderWidth: 1,
  },
});
