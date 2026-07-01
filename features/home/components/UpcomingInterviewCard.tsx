import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text, useTheme } from '@/design-system';

import { UPCOMING_INTERVIEW } from '../constants/mockData';

export function UpcomingInterviewCard() {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <Card variant="elevated" padding="4" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm }]}>
          <Icon name="calendar-outline" size="sm" color={theme.colors.brand.primaryLight} />
        </View>
        <Icon name="chevron-forward" size="sm" color={theme.colors.text.muted} />
      </View>
      <Text variant="caption" color={theme.colors.text.muted}>
        Upcoming Interview
      </Text>
      <Text variant="label" color={theme.colors.text.primary}>
        {UPCOMING_INTERVIEW.role}
      </Text>
      <Text variant="caption" color={theme.colors.brand.primaryLight}>
        {UPCOMING_INTERVIEW.company} · {UPCOMING_INTERVIEW.date}
      </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  card: { flex: 1, gap: 6, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
