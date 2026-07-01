import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedAIOrb, Text, useTheme } from '@/design-system';
import { easing } from '@/design-system/tokens';

interface TypingIndicatorProps {
  visible: boolean;
}

function AnimatedDot() {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400, easing: easing.standard }),
        withTiming(0.3, { duration: 400, easing: easing.standard })
      ),
      -1,
      false
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.dot,
        style,
        { backgroundColor: theme.colors.brand.primaryLight, borderRadius: 4 },
      ]}
    />
  );
}

export function TypingIndicator({ visible }: TypingIndicatorProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <AnimatedAIOrb size={28} />
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text variant="caption" color={theme.colors.text.muted} style={styles.label}>
          Thinking...
        </Text>
        <View style={styles.dots}>
          <AnimatedDot />
          <AnimatedDot />
          <AnimatedDot />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  label: { fontWeight: '500' },
  dots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
  },
});
