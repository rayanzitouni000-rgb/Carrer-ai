import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, useTheme } from '@/design-system';

interface PremiumBadgeProps {
  size?: 'sm' | 'md';
}

export function PremiumBadge({ size = 'sm' }: PremiumBadgeProps) {
  const theme = useTheme();
  const isMd = size === 'md';

  return (
    <LinearGradient
      colors={['#F59E0B', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.badge,
        {
          borderRadius: theme.radius.full,
          paddingHorizontal: isMd ? 12 : 8,
          paddingVertical: isMd ? 6 : 4,
        },
      ]}
    >
      <Text variant={isMd ? 'label' : 'caption'} color="#FFFFFF">
        ✨ Premium
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});
