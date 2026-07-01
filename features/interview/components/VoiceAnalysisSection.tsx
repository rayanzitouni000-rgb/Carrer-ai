import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, CircularProgress, Text, useTheme } from '@/design-system';

import { VOICE_METRICS } from '../constants/mockData';

function MetricItem({ label, value, index }: { label: string; value: number; index: number }) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(240 + index * 50).duration(400)} style={styles.metric}>
      <CircularProgress
        progress={value}
        size={64}
        strokeWidth={5}
        color={theme.colors.brand.primaryLight}
        showLabel
      />
      <Text variant="caption" color={theme.colors.text.secondary} align="center" style={styles.label}>
        {label}
      </Text>
    </Animated.View>
  );
}

export function VoiceAnalysisSection() {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Voice Analysis
      </Text>
      <Card variant="elevated" padding="4">
        <View style={styles.grid}>
          {VOICE_METRICS.map((metric, index) => (
            <MetricItem key={metric.id} label={metric.label} value={metric.value} index={index} />
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  metric: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
    minWidth: 90,
  },
  label: { fontWeight: '600', lineHeight: 14 },
});
