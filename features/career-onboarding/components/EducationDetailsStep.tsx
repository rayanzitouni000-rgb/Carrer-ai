import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { AiFormSelect } from '@/components/onboarding';
import { Card, Input, Text, useTheme } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import { EDUCATION_LEVELS } from '../data/educationLevelsData';
import { FIELD_OPTIONS } from '../constants';
import { ChipSelector } from './SelectableOptionCard';
import type { CareerProfile, EducationLevel } from '../types';

interface EducationDetailsStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function EducationDetailsStep({ profile, onChange }: EducationDetailsStepProps) {
  const theme = useTheme();
  const needsEducationLevel = profile.educationLevel === null;

  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.educationDetails ?? ''} />

      <Card variant="elevated" padding="5" style={styles.card}>
        {needsEducationLevel ? (
          <AiFormSelect
            mode="single"
            label="Mon niveau d'études"
            options={EDUCATION_LEVELS}
            selectedId={profile.educationLevel}
            onSelect={(id) => onChange({ educationLevel: id as EducationLevel })}
          />
        ) : null}

        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Domaine d&apos;études
          </Text>
          <ChipSelector
            options={FIELD_OPTIONS}
            selected={profile.fieldOfStudy}
            onSelect={(fieldOfStudy) => onChange({ fieldOfStudy })}
          />
        </View>

        <Input
          label="Diplôme (optionnel)"
          placeholder="Ex. Master en informatique"
          value={profile.diploma}
          onChangeText={(diploma) => onChange({ diploma })}
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
    gap: 20,
    marginTop: 4,
    overflow: 'visible',
  },
  section: {
    gap: 12,
  },
});
