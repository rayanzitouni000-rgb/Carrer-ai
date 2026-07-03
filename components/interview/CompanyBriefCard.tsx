import { StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/design-system';
import type { CompanyBriefing } from '@/types/interviewSimulator';

interface CompanyBriefCardProps {
  companyName: string;
  briefing: CompanyBriefing;
}

export function CompanyBriefCard({ companyName, briefing }: CompanyBriefCardProps) {
  const theme = useTheme();
  const isLowConfidence = briefing.confidence === 'low';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card.elevated,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {isLowConfidence && (
        <View
          style={[
            styles.warningBanner,
            {
              backgroundColor: 'rgba(249, 115, 22, 0.12)',
              borderColor: 'rgba(249, 115, 22, 0.35)',
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <Text variant="caption" color="#F97316">
            ⚠️ Informations limitées — entreprise peu documentée, vérifie ces infos toi-même
          </Text>
        </View>
      )}

      <Text variant="title" color={theme.colors.text.primary}>
        🏢 À propos de {companyName}
      </Text>

      <View style={styles.metaRow}>
        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          Secteur : {briefing.sector}
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          Taille : {briefing.size}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="label" color={theme.colors.text.secondary}>
          Activité
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.primary}>
          {briefing.activity}
        </Text>
      </View>

      {briefing.values.length > 0 && (
        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Valeurs
          </Text>
          {briefing.values.map((value) => (
            <Text key={value} variant="bodySmall" color={theme.colors.text.primary}>
              • {value}
            </Text>
          ))}
        </View>
      )}

      {briefing.interviewTips.length > 0 && (
        <View style={styles.section}>
          <Text variant="label" color={theme.colors.brand.primaryLight}>
            💡 Conseils pour l&apos;entretien
          </Text>
          {briefing.interviewTips.map((tip) => (
            <Text key={tip} variant="bodySmall" color={theme.colors.text.primary}>
              • {tip}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  warningBanner: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaRow: { gap: 4 },
  section: { gap: 6 },
});
