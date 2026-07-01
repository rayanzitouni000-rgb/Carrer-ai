import { StyleSheet, Switch, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useResetCareerProfile } from '@/features/career-onboarding/hooks/useResetCareerProfile';
import { useToggle } from '@/hooks/useToggle';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
}

function SettingRow({ label, description, value, onToggle }: SettingRowProps) {
  return (
    <Card padding="md">
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textPrimary}
        />
      </View>
    </Card>
  );
}

export default function SettingsScreen() {
  const [notifications, , setNotifications] = useToggle(true);
  const [darkMode, , setDarkMode] = useToggle(true);
  const [emailUpdates, , setEmailUpdates] = useToggle(false);
  const { confirmReset } = useResetCareerProfile({ clearSession: true });

  return (
    <ScreenLayout title="Paramètres" showBack scrollable>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <SettingRow
        label="Notifications push"
        description="Recevoir des alertes pour les nouvelles offres"
        value={notifications}
        onToggle={() => setNotifications(!notifications)}
      />
      <SettingRow
        label="Emails hebdomadaires"
        description="Résumé de votre progression"
        value={emailUpdates}
        onToggle={() => setEmailUpdates(!emailUpdates)}
      />

      <Text style={styles.sectionTitle}>Apparence</Text>
      <SettingRow
        label="Mode sombre"
        description="Thème sombre activé par défaut"
        value={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
      />

      <Text style={styles.sectionTitle}>Données</Text>
      <Card padding="md">
        <Text style={styles.settingLabel}>Profil carrière</Text>
        <Text style={styles.settingDescription}>
          Efface toutes les réponses de l&apos;onboarding (infos, formation, compétences) et
          repart du début.
        </Text>
        <Button
          title="Réinitialiser mon profil"
          variant="outline"
          size="sm"
          onPress={confirmReset}
          style={styles.resetButton}
        />
      </Card>

      <Card padding="md">
        <Text style={styles.infoLabel}>Version</Text>
        <Text style={styles.infoValue}>1.0.0 (mock)</Text>
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  settingInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  settingLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  resetButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
});
