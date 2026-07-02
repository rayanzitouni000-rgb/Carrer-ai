import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text, useTheme } from '@/design-system';

const BAR_COUNT = 5;

interface InterviewAudioVisualizerProps {
  active: boolean;
  muted?: boolean;
}

function AudioBar({ active, delayMs }: { active: boolean; delayMs: number }) {
  const height = useSharedValue(6);

  useEffect(() => {
    if (!active) {
      height.value = withTiming(6, { duration: 200 });
      return;
    }
    height.value = withRepeat(
      withSequence(
        withTiming(22, { duration: 280 + delayMs, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 260 + delayMs, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [active, delayMs, height]);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return <Animated.View style={[styles.bar, barStyle]} />;
}

export function InterviewAudioVisualizer({ active, muted }: InterviewAudioVisualizerProps) {
  const theme = useTheme();
  const showActive = active && !muted;

  return (
    <View style={styles.wrap}>
      <Text variant="caption" color={theme.colors.text.muted}>
        🎙️
      </Text>
      <View style={styles.bars}>
        {Array.from({ length: BAR_COUNT }).map((_, index) => (
          <AudioBar key={index} active={showActive} delayMs={index * 40} />
        ))}
      </View>
      <Text variant="caption" color={showActive ? theme.colors.status.success : theme.colors.text.muted}>
        {muted ? 'Micro coupé' : showActive ? 'Tu parles...' : 'Maintiens pour répondre'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 28,
  },
  bar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
});
