import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { Card } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import { CURRENT_PROFILE_OPTIONS, getCurrentProfileOptionId } from '../constants';
import { OptionCardGrid } from './onboarding/OptionCardGrid';
import type { CareerProfile } from '../types';

interface CurrentProfileStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function CurrentProfileStep({ profile, onChange }: CurrentProfileStepProps) {
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
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.currentProfile ?? ''} />

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
