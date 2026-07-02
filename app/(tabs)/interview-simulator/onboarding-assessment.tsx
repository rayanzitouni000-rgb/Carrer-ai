import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

import { AiCharacterAvatar, AiSpeechBubble } from '@/components/aiCharacter';
import { OutlineButton, PrimaryButton, ScreenContainer, Text, useTheme } from '@/design-system';
import { useOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import { careerProfileStore } from '@/services/careerProfileStore';

export default function OnboardingAssessmentScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { markAssessmentSkipped } = useOnboardingAssessment();
  const profile = useMemo(() => careerProfileStore.get(), []);
  const targetRole = profile.targetRoles[0] ?? 'Poste visé';

  const handleStart = () => {
    router.replace({
      pathname: './session',
      params: { isAssessment: 'true', targetRole },
    });
  };

  const handleSkip = async () => {
    await markAssessmentSkipped();
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable safeAreaBottom contentStyle={{ paddingTop: insets.top + 16, gap: 24 }}>
      <View style={styles.center}>
        <AiCharacterAvatar state="speaking" size="large" />
        <AiSpeechBubble message="Avant de commencer, testons ton niveau actuel en entretien. Ça prend 5 minutes." />
      </View>

      <View style={[styles.note, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.lg }]}>
        <Text variant="caption" color={theme.colors.text.muted}>
          Poste de référence : {targetRole}
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Commencer l'évaluation" fullWidth size="lg" onPress={handleStart} />
        <OutlineButton label="Passer pour l'instant" fullWidth onPress={() => void handleSkip()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 8 },
  note: { padding: 12 },
  footer: { gap: 12, marginTop: 'auto' },
});
