import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedAIOrb, Text, useTheme } from '@/design-system';

import { AI_COACH } from '../constants/mockData';

export function ChatHeader() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.container}>
      <View style={styles.left}>
        <AnimatedAIOrb size={56} />
        <View style={styles.textBlock}>
          <Text variant="h3" color={theme.colors.text.primary}>
            AI Career Coach
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            Always here to help you grow professionally
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.onlineDot, { backgroundColor: theme.colors.status.success }]} />
            <Text variant="caption" color={theme.colors.status.success}>
              {AI_COACH.status}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  textBlock: { flex: 1, gap: 3 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
