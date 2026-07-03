import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';

import { Input, PrimaryButton, ScreenContainer, Text, useTheme } from '@/design-system';
import { useCoverLetterGenerator } from '@/hooks/useCoverLetterGenerator';

export default function CoverLetterIndexScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { jobOfferId } = useLocalSearchParams<{ jobOfferId?: string }>();
  const { data, updateField, loadFromJobOffer } = useCoverLetterGenerator();
  const [didAutoNavigate, setDidAutoNavigate] = useState(false);

  const isLocked = Boolean(jobOfferId);
  const canContinue = data.jobTitle.trim().length > 0 && data.company.trim().length > 0;

  useEffect(() => {
    if (jobOfferId) {
      loadFromJobOffer(jobOfferId);
    }
  }, [jobOfferId, loadFromJobOffer]);

  useEffect(() => {
    if (!isLocked || !canContinue || didAutoNavigate) return;
    setDidAutoNavigate(true);
    router.replace('/cover-letter/generate' as Href);
  }, [isLocked, canContinue, didAutoNavigate, router]);

  const handleGenerate = () => {
    if (!canContinue) return;
    router.push('/cover-letter/generate' as Href);
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Lettre de motivation" contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.text.primary}>
          Pour quel poste ?
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Indique le poste et l&apos;entreprise pour générer ta lettre avec l&apos;IA.
        </Text>
      </View>

      <Input
        label="Intitulé du poste"
        value={data.jobTitle}
        onChangeText={(value) => updateField('jobTitle', value)}
        placeholder="Ex. Développeur React Native"
        editable={!isLocked}
      />
      <Input
        label="Entreprise"
        value={data.company}
        onChangeText={(value) => updateField('company', value)}
        placeholder="Ex. TechCorp"
        editable={!isLocked}
      />

      {isLocked && canContinue ? (
        <Text variant="caption" color={theme.colors.text.muted} align="center">
          Redirection vers la génération…
        </Text>
      ) : (
        <PrimaryButton
          label="Générer ma lettre"
          fullWidth
          size="lg"
          disabled={!canContinue}
          onPress={handleGenerate}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20 },
  header: { gap: 8 },
});
