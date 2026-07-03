import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { Text, useTheme } from '@/design-system';
import type { TranscriptEntry } from '@/types/interviewSimulator';

export interface TranscriptBubbleProps {
  entry: TranscriptEntry;
  index?: number;
}

function TypingIndicator() {
  const theme = useTheme();
  const dot1 = useSharedValue(0.35);
  const dot2 = useSharedValue(0.35);
  const dot3 = useSharedValue(0.35);

  useEffect(() => {
    const animateDot = (value: SharedValue<number>) => {
      value.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 320, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.35, { duration: 320, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    };
    animateDot(dot1);
    animateDot(dot2);
    animateDot(dot3);
  }, [dot1, dot2, dot3]);

  const dotStyle1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dotStyle2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dotStyle3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={styles.typingRow}>
      <Animated.View style={[styles.dot, { backgroundColor: theme.colors.text.muted }, dotStyle1]} />
      <Animated.View style={[styles.dot, { backgroundColor: theme.colors.text.muted }, dotStyle2]} />
      <Animated.View style={[styles.dot, { backgroundColor: theme.colors.text.muted }, dotStyle3]} />
    </View>
  );
}

export function TranscriptBubble({ entry, index = 0 }: TranscriptBubbleProps) {
  const theme = useTheme();
  const isAi = entry.role === 'ai';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).springify()}
      style={[styles.row, isAi ? styles.rowAi : styles.rowUser]}
    >
      {isAi ? (
        <View style={styles.avatarWrap}>
          <AiCharacterAvatar state="idle" size="small" />
        </View>
      ) : null}

      <View
        style={[
          styles.bubble,
          isAi
            ? {
                backgroundColor: theme.colors.card.default,
                borderColor: theme.colors.border.subtle,
              }
            : {
                backgroundColor: 'rgba(43, 108, 255, 0.18)',
                borderColor: 'rgba(43, 108, 255, 0.35)',
              },
          entry.isError && {
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            borderColor: 'rgba(239, 68, 68, 0.35)',
          },
        ]}
      >
        {entry.isPending ? (
          <TypingIndicator />
        ) : (
          <Text
            variant="body"
            color={entry.isError ? theme.colors.status.danger : theme.colors.text.primary}
          >
            {entry.text}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  rowAi: {
    justifyContent: 'flex-start',
    paddingRight: 48,
  },
  rowUser: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingLeft: 56,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bubble: {
    flexShrink: 1,
    maxWidth: '82%',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 42,
    justifyContent: 'center',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
