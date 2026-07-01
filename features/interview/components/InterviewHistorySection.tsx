import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, CircularProgress, Icon, Text, useTheme } from '@/design-system';

import { INTERVIEW_HISTORY } from '../constants/mockData';

export function InterviewHistorySection() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(560).duration(500).springify()} style={styles.section}>
      <View style={styles.header}>
        <Text variant="title" color={theme.colors.text.primary}>
          Interview History
        </Text>
        <Text variant="caption" color={theme.colors.brand.primaryLight}>
          Recent sessions
        </Text>
      </View>

      {INTERVIEW_HISTORY.map((session, index) => (
        <Animated.View key={session.id} entering={FadeInDown.delay(580 + index * 50).duration(400)}>
          <Card padding="4" style={styles.card}>
            <View style={[styles.logo, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.sm }]}>
              <Icon name="business-outline" size="sm" color={theme.colors.brand.primaryLight} />
            </View>
            <View style={styles.info}>
              <Text variant="label" color={theme.colors.text.primary}>
                {session.company}
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                {session.role}
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                {session.date}
              </Text>
            </View>
            <View style={styles.scoreCol}>
              <Text variant="h3" color={theme.colors.text.primary}>
                {session.score}
              </Text>
              <CircularProgress progress={session.score} size={32} strokeWidth={3} showLabel={false} color={theme.colors.status.success} />
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
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  logo: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  scoreCol: { alignItems: 'center', gap: 2 },
});
