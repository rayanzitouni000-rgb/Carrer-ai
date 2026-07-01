import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, CircularProgress, Icon, Text, useTheme } from '@/design-system';

import { ANALYSIS_HISTORY } from '../constants/mockData';

export function AnalysisHistorySection() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(540).duration(500).springify()} style={styles.section}>
      <View style={styles.header}>
        <Text variant="title" color={theme.colors.text.primary}>
          Last Analysis
        </Text>
        <Text variant="caption" color={theme.colors.brand.primaryLight}>
          History
        </Text>
      </View>

      <Text variant="caption" color={theme.colors.text.muted} style={styles.subLabel}>
        Recent Uploads
      </Text>

      {ANALYSIS_HISTORY.map((item, index) => (
        <Animated.View key={item.id} entering={FadeInDown.delay(560 + index * 60).duration(400)}>
          <Card padding="4" style={styles.historyCard}>
            <View style={[styles.fileIcon, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.sm }]}>
              <Icon name="document-text-outline" size="sm" color={theme.colors.brand.primaryLight} />
            </View>
            <View style={styles.info}>
              <Text variant="label" color={theme.colors.text.primary} numberOfLines={1}>
                {item.fileName}
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                {item.date}
              </Text>
            </View>
            <View style={styles.scores}>
              <Text variant="caption" color={theme.colors.text.secondary}>
                {item.score}
              </Text>
              <CircularProgress progress={item.atsScore} size={36} strokeWidth={3} showLabel={false} color={theme.colors.status.success} />
            </View>
          </Card>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subLabel: { letterSpacing: 0.5, marginBottom: 4 },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  fileIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  scores: { alignItems: 'center', gap: 2 },
});
