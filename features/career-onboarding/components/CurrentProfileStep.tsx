import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { AiFormSelect } from '@/components/onboarding';
import { Card } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import { CURRENT_SITUATIONS } from '../data/currentSituationsData';
import type { CareerProfile, CurrentSituation } from '../types';

interface CurrentProfileStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function CurrentProfileStep({ profile, onChange }: CurrentProfileStepProps) {
  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.currentProfile ?? ''} />

      <Card variant="elevated" padding="5" style={styles.card}>
        <AiFormSelect
          mode="single"
          label="Ma situation actuelle"
          options={CURRENT_SITUATIONS}
          selectedId={profile.currentSituation}
          onSelect={(id) => onChange({ currentSituation: id as CurrentSituation })}
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
    gap: 4,
    overflow: 'visible',
  },
});
