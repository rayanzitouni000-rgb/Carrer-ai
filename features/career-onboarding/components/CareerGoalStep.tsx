import { StyleSheet, View } from 'react-native';

import { Card, Text, useTheme } from '@/design-system';

import { CAREER_GOAL_OPTIONS } from '../constants';
import { OptionCardGrid } from './onboarding/OptionCardGrid';
import type { CareerGoalId, CareerProfile } from '../types';

interface CareerGoalStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function CareerGoalStep({ profile, onChange }: CareerGoalStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="h2" color={theme.colors.text.primary}>
        Quel est ton objectif principal ?
      </Text>
      <Text variant="body" color={theme.colors.text.secondary}>
        Choisis ce qui compte le plus pour toi en ce moment.
      </Text>

      <Card variant="elevated" padding="5" style={styles.card}>
        <OptionCardGrid
          options={CAREER_GOAL_OPTIONS}
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
  },
});
