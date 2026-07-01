import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon, IconName, PressableScale, Text, useTheme } from '@/design-system';

interface CvManagerActionCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: readonly [string, string];
  onPress: () => void;
}

export function CvManagerActionCard({
  title,
  subtitle,
  icon,
  gradient,
  onPress,
}: CvManagerActionCardProps) {
  const theme = useTheme();

  return (
    <PressableScale scale={0.98} onPress={onPress}>
      <View
        style={[
          styles.card,
          theme.shadows.sm,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.iconWrap, { borderRadius: theme.radius.md }]}
        >
          <Icon name={icon} size="md" color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.text}>
          <Text variant="title" color={theme.colors.text.primary}>
            {title}
          </Text>
          <Text variant="caption" color={theme.colors.text.secondary}>
            {subtitle}
          </Text>
        </View>
        <Icon name="chevron-forward" size="sm" color={theme.colors.text.muted} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
