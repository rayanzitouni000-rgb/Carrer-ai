import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { AiFormSelect, ConditionalSituationFields } from '@/components/onboarding';
import { Card, Input } from '@/design-system';
import { EMPTY_SITUATION_DETAILS } from '@/types/onboarding';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import { CURRENT_SITUATIONS } from '../data/currentSituationsData';
import { EDUCATION_LEVELS } from '../data/educationLevelsData';
import { deriveEducationLevel } from '../utils/deriveEducationLevel';
import {
  isActiveStudySituation,
  requiresPastEducationInput,
} from '../utils/educationSituationUtils';
import type { CareerProfile, CurrentSituation, EducationLevel } from '../types';

interface EducationDetailsStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

function syncEducationLevel(partial: Partial<CareerProfile>, base: CareerProfile): Partial<CareerProfile> {
  const merged = { ...base, ...partial };
  const situation = merged.currentSituation;

  if (situation && isActiveStudySituation(situation)) {
    const derived = deriveEducationLevel(merged);
    return { ...partial, educationLevel: derived };
  }

  if (partial.currentSituation !== undefined) {
    return { ...partial, educationLevel: null };
  }

  return partial;
}

export function EducationDetailsStep({ profile, onChange }: EducationDetailsStepProps) {
  const showPastEducation = requiresPastEducationInput(profile.currentSituation);

  const handleSituationSelect = (id: string) => {
    onChange(
      syncEducationLevel(
        {
          currentSituation: id as CurrentSituation,
          situationDetails: { ...EMPTY_SITUATION_DETAILS },
        },
        profile
      )
    );
  };

  const handleSituationDetailsChange = (partial: Partial<CareerProfile['situationDetails']>) => {
    onChange(
      syncEducationLevel(
        { situationDetails: { ...profile.situationDetails, ...partial } },
        profile
      )
    );
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

        {showPastEducation ? (
          <AiFormSelect
            mode="single"
            label="Ma formation la plus élevée obtenue"
            options={EDUCATION_LEVELS}
            selectedId={profile.educationLevel}
            onSelect={(id) => onChange({ educationLevel: id as EducationLevel })}
          />
        ) : null}

        <Input
          label={showPastEducation ? 'Précise ton diplôme (optionnel)' : 'Diplôme (optionnel)'}
          placeholder={
            showPastEducation
              ? 'Ex. Licence pro Commerce, BTS NDRC, Master RH...'
              : 'Ex. Master en informatique'
          }
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
