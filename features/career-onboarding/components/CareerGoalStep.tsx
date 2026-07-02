import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { AiFormSelect } from '@/components/onboarding';
import { Card } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import { CAREER_GOALS } from '../data/careerGoalsData';
import type { CareerGoalId, CareerProfile } from '../types';

interface CareerGoalStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function CareerGoalStep({ profile, onChange }: CareerGoalStepProps) {
  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.goal ?? ''} />

      <Card variant="elevated" padding="5" style={styles.card}>
        <AiFormSelect
          mode="single"
          label="Mon objectif"
          options={CAREER_GOALS}
          selectedId={profile.careerGoal}
          onSelect={(id) => onChange({ careerGoal: id as CareerGoalId })}
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
    overflow: 'visible',
  },
});
