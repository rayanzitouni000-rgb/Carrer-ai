import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import { Icon, OutlineButton, PrimaryButton, ScreenContainer, Text, useTheme, useToast } from '@/design-system';
import { getApiBaseUrl, isAiApiConfigured, QUOTA_EXCEEDED_MESSAGE } from '@/constants/apiConfig';
import { useCoverLetterGenerator } from '@/hooks/useCoverLetterGenerator';
import { careerProfileStore } from '@/services/careerProfileStore';
import { getJobOfferById } from '@/utils/jobOfferResolver';

export default function CoverLetterGenerateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { data, updateField } = useCoverLetterGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    void generateLetter();
  }, []);

  const generateLetter = async () => {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl || !isAiApiConfigured()) {
      toast.show({ type: 'error', title: 'API non configurée' });
      router.back();
      return;
    }

    setIsGenerating(true);
    try {
      await careerProfileStore.hydrate();
      const profile = careerProfileStore.get();
      const selectedJobOffer = data.jobOfferId ? getJobOfferById(data.jobOfferId) : null;
      const jobOffer =
        selectedJobOffer ??
        (data.jobTitle || data.company
          ? {
              title: data.jobTitle,
              company: data.company,
              description: '',
              requiredSkills: [] as string[],
            }
          : null);

      const response = await fetch(`${baseUrl}/api/generate-cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, jobOffer }),
      });

      const payload = (await response.json()) as {
        letterContent?: {
          introText?: string;
          motivationText?: string;
          closingText?: string;
        };
        error?: string;
      };

      if (response.status === 429 && payload.error === 'QUOTA_EXCEEDED') {
        toast.show({ type: 'warning', title: QUOTA_EXCEEDED_MESSAGE });
        router.back();
        return;
      }

      if (!response.ok || !payload.letterContent) {
        toast.show({
          type: 'error',
          title: payload.error ?? 'Erreur lors de la génération',
        });
        router.back();
        return;
      }

      updateField('introText', payload.letterContent.introText ?? '');
      updateField('motivationText', payload.letterContent.motivationText ?? '');
      updateField('closingText', payload.letterContent.closingText ?? '');
      router.replace('/cover-letter/preview' as Href);
    } catch {
      toast.show({
        type: 'error',
        title: 'Impossible de joindre le serveur. Réessaie plus tard.',
      });
      router.back();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScreenContainer safeAreaBottom showBack title="Génération IA">
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
        {isGenerating ? (
          <>
            <ActivityIndicator color={theme.colors.brand.primaryLight} />
            <Text variant="h3" color={theme.colors.text.primary} align="center">
              Rédaction en cours…
            </Text>
            <Text variant="body" color={theme.colors.text.secondary} align="center">
              L'IA personnalise ta lettre pour {data.company || 'cette entreprise'}.
            </Text>
          </>
        ) : (
          <Text variant="body" color={theme.colors.text.secondary} align="center">
            Préparation de la génération…
          </Text>
        )}
      </View>

      <OutlineButton label="Annuler" fullWidth onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 24,
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
});
