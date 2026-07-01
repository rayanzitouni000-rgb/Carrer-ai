import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import {
  CircularProgress,
  Text,
  usePulseAnimation,
  useTheme,
} from '@/design-system';

import { CAREER_SCORE } from '../constants/mockData';
import { useAnimatedCounter } from '../hooks';

export function CareerScoreCard() {
  const theme = useTheme();
  const glowStyle = usePulseAnimation(0.97, 1.03);
  const animatedScore = useAnimatedCounter(CAREER_SCORE.current, 1600, 200);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.glow, glowStyle, theme.shadows.glow]} />

      <LinearGradient
        colors={['#111827', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderRadius: theme.radius.xl,
            borderColor: 'rgba(59, 130, 246, 0.25)',
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(59,130,246,0.15)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.xl }]}
        />

        <View style={styles.content}>
          <View style={styles.left}>
            <Text variant="label" color={theme.colors.text.secondary}>
              Career Score
            </Text>
            <View style={styles.scoreRow}>
              <Text variant="hero" color={theme.colors.text.primary} style={styles.score}>
                {animatedScore}
              </Text>
              <Text variant="subtitle" color={theme.colors.text.muted}>
                / {CAREER_SCORE.max}
              </Text>
            </View>
            <Text variant="title" color={theme.colors.brand.primaryLight} style={styles.status}>
              {CAREER_SCORE.status}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.desc}>
              {CAREER_SCORE.description}
            </Text>
          </View>

          <View style={styles.ringWrap}>
            <CircularProgress
              progress={CAREER_SCORE.percentage}
              size={100}
              strokeWidth={7}
              color={theme.colors.brand.primaryLight}
              trackColor="rgba(255,255,255,0.08)"
              showLabel
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  glow: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    bottom: -4,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  card: {
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: { flex: 1, gap: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  score: { fontSize: 40, lineHeight: 48 },
  status: { marginTop: 4 },
  desc: { marginTop: 6, lineHeight: 20 },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
});
