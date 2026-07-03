import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, CircularProgress, Icon, Text, useTheme } from '@/design-system';
import { useAnimatedCounter } from '@/features/home/hooks';

import type { CvAnalysisResult } from '../types/cvAnalysisResult';

interface ScoreCardsProps {
  analysis: CvAnalysisResult;
}

export function AtsScoreCard({ analysis }: ScoreCardsProps) {
  const theme = useTheme();
  const atsValue = Math.min(100, Math.max(0, analysis.score + 4));
  const value = useAnimatedCounter(atsValue, 1400, 200);

  return (
    <Animated.View entering={FadeInDown.delay(160).duration(500).springify()} style={styles.flex}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(52,211,153,0.12)', borderRadius: theme.radius.sm }]}>
          <Icon name="checkmark-circle-outline" size="sm" color={theme.colors.status.success} />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          Compatibilité ATS
        </Text>
        <View style={styles.scoreRow}>
          <Text variant="h2" color={theme.colors.text.primary}>
            {value}%
          </Text>
          <CircularProgress
            progress={atsValue}
            size={48}
            strokeWidth={4}
            color={theme.colors.status.success}
            showLabel={false}
          />
        </View>
        <Text variant="caption" color={theme.colors.text.secondary} style={styles.desc}>
          Estimation basée sur la structure et les mots-clés du CV analysé.
        </Text>
      </Card>
    </Animated.View>
  );
}

export function OverallScoreCard({ analysis }: ScoreCardsProps) {
  const theme = useTheme();
  const overall = Math.round(analysis.score) / 10;
  const displayValue = useAnimatedCounter(Math.round(overall * 10), 1400, 250);
  const percentage = Math.min(100, Math.max(0, analysis.score));

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(500).springify()} style={styles.flex}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm }]}>
          <Icon name="star" size="sm" color={theme.colors.brand.primaryLight} />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          Note globale
        </Text>
        <View style={styles.scoreRow}>
          <Text variant="h2" color={theme.colors.text.primary}>
            {(displayValue / 10).toFixed(1)}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.muted}>
            / 10
          </Text>
        </View>
        <View style={[styles.gaugeTrack, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.full }]}>
          <View
            style={[
              styles.gaugeFill,
              {
                width: `${percentage}%`,
                backgroundColor: theme.colors.brand.primary,
                borderRadius: theme.radius.full,
              },
            ]}
          />
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 8, flex: 1 },
  iconBox: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  desc: { lineHeight: 18, marginTop: 4 },
  gaugeTrack: { height: 6, overflow: 'hidden', marginTop: 4 },
  gaugeFill: { height: '100%' },
});
