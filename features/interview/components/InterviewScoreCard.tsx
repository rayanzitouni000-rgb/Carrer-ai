import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CircularProgress, Text, usePulseAnimation, useTheme } from '@/design-system';
import { useAnimatedCounter } from '@/features/home/hooks';

import { INTERVIEW_SCORE } from '../constants/mockData';

export function InterviewScoreCard() {
  const theme = useTheme();
  const glowStyle = usePulseAnimation(0.97, 1.03);
  const animatedScore = useAnimatedCounter(INTERVIEW_SCORE.overall, 1600, 300);

  return (
    <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.glow, glowStyle, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]} />
        <LinearGradient
          colors={['#111827', '#1E293B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderRadius: theme.radius.xl, borderColor: 'rgba(59, 130, 246, 0.25)' }]}
        >
          <View style={styles.content}>
            <View style={styles.left}>
              <Text variant="label" color={theme.colors.text.secondary}>
                Overall Score
              </Text>
              <View style={styles.scoreRow}>
                <Text variant="hero" color={theme.colors.text.primary} style={styles.scoreNum}>
                  {animatedScore}
                </Text>
                <Text variant="subtitle" color={theme.colors.text.muted}>
                  / {INTERVIEW_SCORE.max}
                </Text>
              </View>
              <Text variant="title" color={theme.colors.status.success}>
                {INTERVIEW_SCORE.rating}
              </Text>
            </View>
            <CircularProgress
              progress={INTERVIEW_SCORE.overall}
              size={96}
              strokeWidth={7}
              color={theme.colors.brand.primaryLight}
              trackColor="rgba(255,255,255,0.08)"
              showLabel
            />
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  glow: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    bottom: -4,
    borderRadius: 24,
  },
  card: { padding: 20, borderWidth: 1, overflow: 'hidden' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1, gap: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  scoreNum: { fontSize: 38, lineHeight: 46 },
});
