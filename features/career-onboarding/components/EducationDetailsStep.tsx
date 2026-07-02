import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { Card, Input, Text, useTheme } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';

import { EDUCATION_LEVEL_OPTIONS, FIELD_OPTIONS } from '../constants';
import { OptionCardGrid } from './onboarding/OptionCardGrid';
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
        {needsEducationLevel && (
          <View style={styles.section}>
            <Text variant="label" color={theme.colors.text.secondary}>
              Niveau de diplôme
            </Text>
            <OptionCardGrid
              options={EDUCATION_LEVEL_OPTIONS}
              selectedId={profile.educationLevel}
              onSelect={(id) => onChange({ educationLevel: id as EducationLevel })}
            />
          </View>
        )}

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
  },
  section: {
    gap: 12,
  },
});
