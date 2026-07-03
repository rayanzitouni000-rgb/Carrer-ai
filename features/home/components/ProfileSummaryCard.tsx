import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text, useTheme } from '@/design-system';
import { useApplicationTracking } from '@/hooks/useApplicationTracking';
import { useCvActionsTracking } from '@/hooks/useCvActionsTracking';
import { careerProfileStore } from '@/services/careerProfileStore';

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  value: string;
}) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm },
        ]}
      >
        <Icon name={icon} size="sm" color={theme.colors.brand.primaryLight} />
      </View>
      <View style={styles.rowText}>
        <Text variant="caption" color={theme.colors.text.muted}>
          {label}
        </Text>
        <Text variant="label" color={theme.colors.text.primary}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function getSuggestedAction(profileComplete: boolean, cvAnalyzed: boolean): string {
  if (!profileComplete) {
    return 'Complète ton profil pour de meilleurs résultats';
  }
  if (!cvAnalyzed) {
    return 'Analyse ton CV pour des recommandations personnalisées';
  }
  return 'Continue tes candidatures — tu es sur la bonne voie';
}

export function ProfileSummaryCard() {
  const theme = useTheme();
  const { monthCount } = useApplicationTracking();
  const { cvAnalyzedCount } = useCvActionsTracking();
  const profileComplete = careerProfileStore.isComplete();
  const cvAnalyzed = cvAnalyzedCount > 0;
  const suggestedAction = getSuggestedAction(profileComplete, cvAnalyzed);

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Résumé de ton profil
      </Text>
      <Card variant="elevated" padding="4" style={styles.card}>
        <SummaryRow
          icon="paper-plane-outline"
          label="Candidatures ce mois-ci"
          value={String(monthCount)}
        />
        <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />
        <SummaryRow
          icon="document-text-outline"
          label="Statut CV"
          value={cvAnalyzed ? 'Analysé' : 'Pas encore analysé'}
        />
        <View style={[styles.hintBox, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.md }]}>
          <Text variant="caption" color={theme.colors.text.muted}>
            Prochaine action
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            {suggestedAction}
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  card: { gap: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  divider: { height: StyleSheet.hairlineWidth },
  hintBox: { padding: 12, gap: 4 },
});
