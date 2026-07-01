import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Card, Icon, OutlineButton, Text, useTheme } from '@/design-system';

import { ROADMAP_PREVIEW } from '../constants/mockData';

const statusColors = {
  current: '#34D399',
  next: '#3B82F6',
  dream: '#8B5CF6',
};

export function RoadmapPreviewCard() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Career Roadmap
      </Text>

      <Card variant="elevated" padding="4">
        <View style={styles.timeline}>
          {ROADMAP_PREVIEW.map((step, index) => {
            const isLast = index === ROADMAP_PREVIEW.length - 1;
            const color = statusColors[step.status];

            return (
              <View key={step.id}>
                <View style={styles.stepRow}>
                  <View style={styles.track}>
                    <View style={[styles.dot, { backgroundColor: `${color}30`, borderColor: color }]}>
                      <View style={[styles.dotInner, { backgroundColor: color }]} />
                    </View>
                    {!isLast && (
                      <LinearGradient
                        colors={[color, `${color}40`]}
                        style={styles.line}
                      />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text variant="caption" color={color}>
                      {step.label}
                    </Text>
                    <Text variant="bodySmall" color={theme.colors.text.primary}>
                      {step.role}
                    </Text>
                  </View>
                  {step.status === 'current' && (
                    <Icon name="checkmark-circle" size="sm" color={color} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <OutlineButton
          label="View Full Roadmap"
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
  timeline: { gap: 0 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 56,
  },
  track: { alignItems: 'center', width: 24 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: { width: 8, height: 8, borderRadius: 4 },
  line: { width: 2, flex: 1, minHeight: 28, marginVertical: 2 },
  stepContent: { flex: 1, gap: 2, paddingBottom: 8 },
  cta: { marginTop: 8 },
});
