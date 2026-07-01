import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PlaceholderContent } from '@/components/PlaceholderContent';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { MOCK_ROADMAP } from '@/constants/mockData';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

const statusConfig = {
  completed: { label: 'Terminé', variant: 'success' as const, icon: 'checkmark-circle' },
  'in-progress': { label: 'En cours', variant: 'primary' as const, icon: 'time' },
  locked: { label: 'Verrouillé', variant: 'default' as const, icon: 'lock-closed' },
};

export default function RoadmapScreen() {
  return (
    <ScreenLayout title="Roadmap" subtitle="Votre parcours vers l'objectif" showBack scrollable>
      <PlaceholderContent
        icon="map-outline"
        title="Roadmap personnalisée"
        description="Suivez les étapes clés pour atteindre votre objectif de carrière."
      />

      <View style={styles.timeline}>
        {MOCK_ROADMAP.map((step, index) => {
          const config = statusConfig[step.status];
          const isLast = index === MOCK_ROADMAP.length - 1;

          return (
            <View key={step.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, step.status === 'completed' && styles.dotCompleted]}>
                  <Ionicons
                    name={config.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={step.status === 'locked' ? colors.textMuted : colors.primary}
                  />
                </View>
                {!isLast && <View style={styles.line} />}
              </View>

              <Card style={styles.stepCard} variant="elevated">
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Badge label={config.label} variant={config.variant} />
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
                <ProgressRing progress={step.progress} size={48} strokeWidth={4} />
              </Card>
            </View>
          );
        })}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  stepCard: {
    flex: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  stepDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
