import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AnimatedAIOrb, Text, useTheme } from '@/design-system';

export function ChatEmptyState() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <View style={styles.orbWrap}>
        <AnimatedAIOrb size={96} />
      </View>
      <Text variant="h3" color={theme.colors.text.primary} align="center">
        Your personal AI career coach is ready.
      </Text>
      <Text variant="bodySmall" color={theme.colors.text.secondary} align="center" style={styles.subtitle}>
        Start a conversation and receive personalized career guidance.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 12,
  },
  orbWrap: {
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 22,
    maxWidth: 280,
  },
});
