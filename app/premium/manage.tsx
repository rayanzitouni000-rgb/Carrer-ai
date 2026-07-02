import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer, Text, useTheme, OutlineButton } from '@/design-system';
import { PremiumBadge } from '@/components/premium';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function ManagePremiumScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { activeProductId, expirationDate, simulateCancel } = usePremiumStatus();

  const productLabel =
    activeProductId === 'premium_weekly'
      ? '9,99€ / semaine'
      : activeProductId === 'premium_yearly'
        ? '39,99€ / an'
        : '—';

  const expirationLabel = expirationDate
    ? new Date(expirationDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const handleCancel = async () => {
    await simulateCancel();
    router.back();
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Mon abonnement">
      <View style={styles.header}>
        <PremiumBadge size="md" />
        <Text variant="h3" color={theme.colors.text.primary}>
          Abonnement actif
        </Text>
      </View>

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
        <Text variant="label" color={theme.colors.text.muted}>
          Formule
        </Text>
        <Text variant="title" color={theme.colors.text.primary}>
          {productLabel}
        </Text>

        <Text variant="label" color={theme.colors.text.muted} style={styles.fieldLabel}>
          Expire le
        </Text>
        <Text variant="body" color={theme.colors.text.primary}>
          {expirationLabel}
        </Text>
      </View>

      <Text variant="caption" color={theme.colors.text.muted} style={styles.note}>
        Environnement de test — l&apos;annulation est simulée localement.
      </Text>

      <OutlineButton label="Annuler mon abonnement (test)" fullWidth onPress={() => void handleCancel()} />
      <OutlineButton label="Retour" fullWidth onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  fieldLabel: {
    marginTop: 12,
  },
  note: {
    marginVertical: 8,
  },
});
