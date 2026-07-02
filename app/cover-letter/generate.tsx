import { StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import { Icon, OutlineButton, PrimaryButton, ScreenContainer, Text, useTheme } from '@/design-system';

export default function CoverLetterGenerateScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Génération IA">
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
        <Icon name="sparkles-outline" size="lg" color={theme.colors.brand.accentLight} />
        <Text variant="h3" color={theme.colors.text.primary} align="center">
          La génération IA de lettre de motivation arrive bientôt !
        </Text>
        <Text variant="body" color={theme.colors.text.secondary} align="center">
          En attendant, utilise le mode Modèle guidé pour rédiger une lettre professionnelle en
          quelques minutes.
        </Text>
        {/* TODO: appeler le backend avec profil + description offre (jobOfferId) */}
      </View>

      <PrimaryButton
        label="Essayer le mode Modèle"
        fullWidth
        onPress={() => router.replace('/cover-letter/template' as Href)}
      />
      <OutlineButton label="Retour" fullWidth onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
});
