import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card, Icon, OutlineButton, Text, useTheme } from '@/design-system';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import type { RoadmapStep } from '@/types';

const statusColors: Record<RoadmapStep['status'], string> = {
  completed: '#34D399',
  'in-progress': '#3B82F6',
  locked: '#64748B',
};

const statusLabels: Record<RoadmapStep['status'], string> = {
  completed: 'Terminé',
  'in-progress': 'En cours',
  locked: 'Verrouillé',
};

function PreviewStepRow({ step }: { step: RoadmapStep }) {
  const theme = useTheme();
  const color = statusColors[step.status];

  return (
    <View style={styles.stepRow}>
      <View style={[styles.dot, { backgroundColor: `${color}30`, borderColor: color }]}>
        <View style={[styles.dotInner, { backgroundColor: color }]} />
      </View>
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text variant="caption" color={color}>
            {statusLabels[step.status]}
          </Text>
          <Text variant="caption" color={theme.colors.text.muted}>
            {step.progress}%
          </Text>
        </View>
        <Text variant="bodySmall" color={theme.colors.text.primary}>
          {step.title}
        </Text>
        <Text variant="caption" color={theme.colors.text.secondary}>
          {step.description}
        </Text>
      </View>
      {step.status === 'completed' && <Icon name="checkmark-circle" size="sm" color={color} />}
    </View>
  );
}

export function RoadmapPreviewCard() {
  const theme = useTheme();
  const router = useRouter();
  const { previewSteps } = useRoadmapProgress();

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Ma progression
      </Text>

      <Card variant="elevated" padding="4">
        <View style={styles.timeline}>
          {previewSteps.map((step) => (
            <PreviewStepRow key={step.id} step={step} />
          ))}
        </View>

        <OutlineButton
          label="Voir la roadmap complète"
          size="sm"
          fullWidth
          onPress={() => router.push('/roadmap')}
          style={styles.cta}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  timeline: { gap: 16 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dotInner: { width: 8, height: 8, borderRadius: 4 },
  stepContent: { flex: 1, gap: 4 },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cta: { marginTop: 12 },
});
