import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, CircularProgress, Icon, Text, useTheme } from '@/design-system';
import { useAnimatedCounter } from '@/features/home/hooks';

import { CV_ANALYSIS } from '../constants/mockData';

export function AtsScoreCard() {
  const theme = useTheme();
  const value = useAnimatedCounter(CV_ANALYSIS.atsScore.value, 1400, 200);

  return (
    <Animated.View entering={FadeInDown.delay(160).duration(500).springify()} style={styles.flex}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(52,211,153,0.12)', borderRadius: theme.radius.sm }]}>
          <Icon name="checkmark-circle-outline" size="sm" color={theme.colors.status.success} />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          ATS Score
        </Text>
        <View style={styles.scoreRow}>
          <Text variant="h2" color={theme.colors.text.primary}>
            {value}%
          </Text>
          <CircularProgress
            progress={CV_ANALYSIS.atsScore.value}
            size={48}
            strokeWidth={4}
            color={theme.colors.status.success}
            showLabel={false}
          />
        </View>
        <Text variant="caption" color={theme.colors.text.secondary} style={styles.desc}>
          {CV_ANALYSIS.atsScore.description}
        </Text>
      </Card>
    </Animated.View>
  );
}

export function OverallScoreCard() {
  const theme = useTheme();
  const displayValue = useAnimatedCounter(Math.round(CV_ANALYSIS.overallScore.value * 10), 1400, 250);

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(500).springify()} style={styles.flex}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm }]}>
          <Icon name="star" size="sm" color={theme.colors.brand.primaryLight} />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          Overall Score
        </Text>
        <View style={styles.scoreRow}>
          <Text variant="h2" color={theme.colors.text.primary}>
            {(displayValue / 10).toFixed(1)}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.muted}>
            / {CV_ANALYSIS.overallScore.max}
          </Text>
        </View>
        <View style={[styles.gaugeTrack, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.full }]}>
          <View
            style={[
              styles.gaugeFill,
              {
                width: `${CV_ANALYSIS.overallScore.percentage}%`,
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
