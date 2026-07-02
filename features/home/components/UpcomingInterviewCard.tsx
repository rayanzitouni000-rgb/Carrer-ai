import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card, Icon, PressableScale, Text, useTheme } from '@/design-system';

import { useRealInterviews } from '@/hooks/useRealInterviews';
import {
  formatRelativeInterviewDays,
  formatShortInterviewDate,
} from '@/utils/interviewSimulatorUtils';

export function UpcomingInterviewCard() {
  const theme = useTheme();
  const router = useRouter();
  const { nextInterview } = useRealInterviews();

  if (nextInterview) {
    return (
      <View style={styles.wrapper}>
        <Card variant="elevated" padding="4" style={styles.card}>
          <View>
            <View style={styles.header}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm },
                ]}
              >
                <Icon name="calendar-outline" size="sm" color={theme.colors.brand.primaryLight} />
              </View>
            </View>
            <Text variant="caption" color={theme.colors.text.muted}>
              Ton prochain entretien
            </Text>
            <Text variant="label" color={theme.colors.text.primary} numberOfLines={1}>
              {nextInterview.company} — {nextInterview.jobTitle}
            </Text>
            <Text variant="caption" color={theme.colors.brand.primaryLight}>
              {formatShortInterviewDate(nextInterview.scheduledAt)} ·{' '}
              {formatRelativeInterviewDays(nextInterview.scheduledAt)}
            </Text>
          </View>

          <PressableScale
            scale={0.97}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/interview-simulator/session',
                params: { interviewId: nextInterview.id },
              })
            }
          >
            <View
              style={[
                styles.cta,
                { backgroundColor: theme.colors.brand.primary, borderRadius: theme.radius.sm },
              ]}
            >
              <Icon name="mic-outline" size="sm" color="#FFFFFF" />
              <Text variant="caption" color="#FFFFFF">
                Se préparer
              </Text>
            </View>
          </PressableScale>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View>
          <View style={styles.header}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm },
              ]}
            >
              <Icon name="calendar-outline" size="sm" color={theme.colors.brand.primaryLight} />
            </View>
          </View>
          <Text variant="caption" color={theme.colors.text.muted}>
            Prochain entretien
          </Text>
          <Text variant="label" color={theme.colors.text.primary}>
            Aucun entretien prévu
          </Text>
        </View>

        <PressableScale
          scale={0.97}
          onPress={() => router.push('/(tabs)/interview-simulator/add-interview')}
        >
          <View style={styles.addRow}>
            <Icon name="add-circle-outline" size="sm" color={theme.colors.brand.primaryLight} />
            <Text variant="caption" color={theme.colors.brand.primaryLight}>
              Ajouter
            </Text>
          </View>
        </PressableScale>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  card: { flex: 1, gap: 10, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
});
