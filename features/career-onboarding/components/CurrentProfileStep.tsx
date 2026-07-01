import { StyleSheet, View } from 'react-native';

import { Card, Text, useTheme } from '@/design-system';

import { CURRENT_PROFILE_OPTIONS, getCurrentProfileOptionId } from '../constants';
import { OptionCardGrid } from './onboarding/OptionCardGrid';
import type { CareerProfile } from '../types';

interface CurrentProfileStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function CurrentProfileStep({ profile, onChange }: CurrentProfileStepProps) {
  const theme = useTheme();
  const selectedId = getCurrentProfileOptionId(profile);

  const handleSelect = (id: string) => {
    const option = CURRENT_PROFILE_OPTIONS.find((item) => item.id === id);
    if (!option) return;

    onChange({
      currentSituation: option.currentSituation,
      educationLevel: option.educationLevel ?? null,
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="h2" color={theme.colors.text.primary}>
        Ton profil actuel
      </Text>
      <Text variant="body" color={theme.colors.text.secondary}>
        Où en es-tu aujourd&apos;hui dans ton parcours ?
      </Text>

      <Card variant="elevated" padding="5" style={styles.card}>
        <OptionCardGrid
          options={CURRENT_PROFILE_OPTIONS}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    marginTop: 4,
  },
});
