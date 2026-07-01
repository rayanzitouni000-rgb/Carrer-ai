import { StyleSheet, View } from 'react-native';

import { SkillsStepContent } from '../skills/components/SkillsStepContent';
import type { CareerProfile } from '../types';

interface SkillsStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
  onRegisterScrollDismiss?: (handler: (() => void) | null) => void;
}

export function SkillsStep({ profile, onChange, onRegisterScrollDismiss }: SkillsStepProps) {
  return (
    <View style={styles.container}>
      <SkillsStepContent
        profile={profile}
        onChange={onChange}
        onRegisterScrollDismiss={onRegisterScrollDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
