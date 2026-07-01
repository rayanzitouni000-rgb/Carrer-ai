import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  CircularProgress,
  OutlineButton,
  PrimaryButton,
  Text,
  useTheme,
} from '@/design-system';

import { RECENT_JOB_MATCHES } from '../constants/mockData';

function JobMatchCard({ job }: { job: (typeof RECENT_JOB_MATCHES)[0] }) {
  const theme = useTheme();

  const matchColor =
    job.matchScore >= 90
      ? theme.colors.status.success
      : job.matchScore >= 80
        ? theme.colors.brand.primaryLight
        : theme.colors.status.warning;

  return (
    <View
      style={[
        styles.card,
        theme.shadows.md,
        {
          backgroundColor: theme.colors.card.elevated,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={[job.logoColor, `${job.logoColor}99`]}
          style={[styles.logo, { borderRadius: theme.radius.md }]}
        >
          <Text variant="label" color="#FFFFFF">
            {job.companyInitials}
          </Text>
        </LinearGradient>
        <View style={styles.headerText}>
          <Text variant="title" color={theme.colors.text.primary} numberOfLines={1}>
            {job.title}
          </Text>
          <Text variant="caption" color={theme.colors.text.muted}>
            {job.company}
          </Text>
        </View>
        <CircularProgress
          progress={job.matchScore}
          size={52}
          strokeWidth={4}
          color={matchColor}
          showLabel
        />
      </View>

      <View style={styles.meta}>
        <Text variant="bodySmall" color={theme.colors.status.success}>
          {job.salary}
        </Text>
        <Text variant="caption" color={theme.colors.text.muted}>
          📍 {job.location}
        </Text>
      </View>

      <View style={styles.actions}>
        <OutlineButton label="Save" size="sm" style={styles.actionBtn} />
        <PrimaryButton label="Apply" size="sm" style={styles.actionBtn} />
      </View>
    </View>
  );
}

export function RecentJobMatches() {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="title" color={theme.colors.text.primary}>
          Recent Job Matches
        </Text>
        <Text variant="caption" color={theme.colors.brand.primaryLight}>
          See all
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={296}
      >
        {RECENT_JOB_MATCHES.map((job) => (
          <JobMatchCard key={job.id} job={job} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scroll: { gap: 14, paddingRight: 4 },
  card: {
    width: 280,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  meta: { gap: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1 },
});
