import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { AiFormSelect, ConditionalSituationFields } from '@/components/onboarding';
import { Card, Input, useTheme } from '@/design-system';
import { EMPTY_SITUATION_DETAILS } from '@/types/onboarding';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import { CURRENT_SITUATIONS } from '../data/currentSituationsData';
import { EDUCATION_LEVELS } from '../data/educationLevelsData';
import type { CareerProfile, CurrentSituation, EducationLevel } from '../types';

interface EducationDetailsStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function EducationDetailsStep({ profile, onChange }: EducationDetailsStepProps) {
  useTheme();

  const handleSituationSelect = (id: string) => {
    onChange({
      currentSituation: id as CurrentSituation,
      situationDetails: { ...EMPTY_SITUATION_DETAILS },
    });
  };

  const handleSituationDetailsChange = (partial: Partial<CareerProfile['situationDetails']>) => {
    onChange({
      situationDetails: { ...profile.situationDetails, ...partial },
    });
  };

  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.educationDetails ?? ''} />

      <Card variant="elevated" padding="5" style={styles.card}>
        <AiFormSelect
          mode="single"
          label="Ma situation actuelle"
          options={CURRENT_SITUATIONS}
          selectedId={profile.currentSituation}
          onSelect={handleSituationSelect}
        />

        {profile.currentSituation ? (
          <ConditionalSituationFields
            situationId={profile.currentSituation}
            details={profile.situationDetails}
            onChange={handleSituationDetailsChange}
          />
        ) : null}

        <AiFormSelect
          mode="single"
          label="Mon niveau d'études"
          options={EDUCATION_LEVELS}
          selectedId={profile.educationLevel}
          onSelect={(id) => onChange({ educationLevel: id as EducationLevel })}
        />

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
});
