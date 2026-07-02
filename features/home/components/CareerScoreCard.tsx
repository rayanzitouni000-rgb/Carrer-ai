import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import {
  CircularProgress,
  Text,
  usePulseAnimation,
  useTheme,
} from '@/design-system';
import { RankBadge } from '@/components/gamification';
import { useCareerScore } from '@/hooks/useCareerScore';

import { useAnimatedCounter } from '../hooks';

export function CareerScoreCard() {
  const theme = useTheme();
  const glowStyle = usePulseAnimation(0.97, 1.03);
  const { score, rank, streakDays, isReady } = useCareerScore();
  const animatedScore = useAnimatedCounter(score, 1600, 200);
  const percentage = Math.round((score / 1000) * 100);

  const statusLabel =
    rank.tier === 'champion'
      ? 'Rang maximum atteint 👑'
      : rank.pointsToNextRank != null
        ? `Encore ${rank.pointsToNextRank} pts pour le rang suivant`
        : 'Continue à progresser';

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
            borderColor: `${rank.color}55`,
          },
        ]}
      >
        <LinearGradient
          colors={[`${rank.color}22`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.xl }]}
        />

        <View style={styles.content}>
          <View style={styles.left}>
            <RankBadge rank={rank} size="large" showProgress streakDays={streakDays} />

            <View style={styles.scoreRow}>
              <Text variant="hero" color={theme.colors.text.primary} style={styles.score}>
                {isReady ? animatedScore : '—'}
              </Text>
              <Text variant="subtitle" color={theme.colors.text.muted}>
                / 1000
              </Text>
            </View>

            <Text variant="title" color={rank.color} style={styles.status}>
              {rank.label}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.desc}>
              {statusLabel}
            </Text>
          </View>

          <View style={styles.ringWrap}>
            <CircularProgress
              progress={percentage}
              size={100}
              strokeWidth={7}
              color={rank.color}
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
  left: { flex: 1, gap: 10 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 },
  score: { fontSize: 40, lineHeight: 48 },
  status: { marginTop: 2 },
  desc: { marginTop: 2, lineHeight: 20 },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
});
