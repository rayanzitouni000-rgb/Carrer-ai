import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { MOCK_ROADMAP, MOCK_SKILLS } from '@/constants/mockData';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function ProgressScreen() {
  const overallProgress = Math.round(
    MOCK_SKILLS.reduce((acc, skill) => acc + skill.progress, 0) / MOCK_SKILLS.length
  );

  return (
    <ScreenLayout title="Progression" subtitle="Suivez votre avancement">
      <Card variant="elevated">
        <View style={styles.overallRow}>
          <ProgressRing progress={overallProgress} size={100} label="Global" />
          <View style={styles.overallInfo}>
            <Text style={styles.overallTitle}>Score carrière</Text>
            <Text style={styles.overallDescription}>
              Continuez sur cette lancée pour atteindre vos objectifs !
            </Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Compétences</Text>
      <View style={styles.skillsGrid}>
        {MOCK_SKILLS.map((skill) => (
          <Card key={skill.id} style={styles.skillCard}>
            <ProgressRing progress={skill.progress} size={56} strokeWidth={4} />
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillCategory}>{skill.category}</Text>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Roadmap</Text>
      {MOCK_ROADMAP.map((step) => (
        <Card key={step.id}>
          <View style={styles.stepRow}>
            <ProgressRing
              progress={step.progress}
              size={44}
              strokeWidth={3}
              showPercentage={false}
              color={
                step.status === 'completed'
                  ? colors.success
                  : step.status === 'in-progress'
                    ? colors.primary
                    : colors.textMuted
              }
            />
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        </Card>
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  overallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  overallInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  overallTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  overallDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  skillCard: {
    width: '47%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  skillName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  skillCategory: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  stepTitle: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  stepDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
