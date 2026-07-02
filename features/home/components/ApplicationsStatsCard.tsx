import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text, useTheme } from '@/design-system';
import { useApplicationTracking } from '@/hooks/useApplicationTracking';

import { useAnimatedCounter } from '../hooks';

interface StatConfig {
  id: string;
  label: string;
  value: number;
  icon: Parameters<typeof Icon>[0]['name'];
}

function StatItem({ stat, index }: { stat: StatConfig; index: number }) {
  const theme = useTheme();
  const value = useAnimatedCounter(stat.value, 1200, 400 + index * 100);

  return (
    <View style={[styles.stat, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.md }]}>
      <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm }]}>
        <Icon name={stat.icon} size="sm" color={theme.colors.brand.primaryLight} />
      </View>
      <Text variant="h3" color={theme.colors.text.primary}>
        {value}
      </Text>
      <Text variant="caption" color={theme.colors.text.muted} numberOfLines={2}>
        {stat.label}
      </Text>
    </View>
  );
}

export function ApplicationsStatsCard() {
  const theme = useTheme();
  const { todayCount, weekCount, monthCount } = useApplicationTracking();

  const stats: StatConfig[] = [
    { id: 'today', label: "Aujourd'hui", value: todayCount, icon: 'paper-plane-outline' },
    { id: 'week', label: 'Cette semaine', value: weekCount, icon: 'calendar-outline' },
    { id: 'month', label: 'Ce mois-ci', value: monthCount, icon: 'trending-up-outline' },
  ];

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Candidatures
      </Text>
      <Card variant="elevated" padding="4">
        <View style={styles.grid}>
          {stats.map((stat, index) => (
            <StatItem key={stat.id} stat={stat} index={index} />
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
    gap: 10,
  },
  stat: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    padding: 14,
    gap: 6,
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
