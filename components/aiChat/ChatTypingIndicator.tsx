import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text, useTheme } from '@/design-system';
import { AiCharacterAvatar } from '@/components/aiCharacter';

function TypingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 320, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.35, { duration: 320, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function ChatTypingIndicator() {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityLabel="Le coach IA est en train d'écrire">
      <View style={styles.avatarWrap}>
        <AiCharacterAvatar state="speaking" size="small" style={styles.avatar} />
      </View>

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
        <View style={styles.dotsRow}>
          <TypingDot delay={0} />
          <TypingDot delay={160} />
          <TypingDot delay={320} />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          Coach IA écrit...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    overflow: 'hidden',
  },
  avatar: {
    transform: [{ scale: 0.75 }],
    marginLeft: -6,
    marginTop: -6,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
});
