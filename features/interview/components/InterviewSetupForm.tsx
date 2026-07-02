import { StyleSheet, View } from 'react-native';

import { Input, PressableScale, Text, useTheme } from '@/design-system';
import type { CareerProfile } from '@/features/career-onboarding/types';
import {
  INTERVIEW_DIFFICULTY_OPTIONS,
  INTERVIEW_TYPE_OPTIONS,
  type InterviewDifficulty,
  type InterviewSessionType,
} from '@/types/interviewSimulator';
import { suggestDifficultyFromSkills } from '@/utils/interviewSimulatorUtils';

interface InterviewSetupFormProps {
  profile: CareerProfile;
  targetRole: string;
  type: InterviewSessionType;
  difficulty: InterviewDifficulty;
  onChangeTargetRole: (value: string) => void;
  onChangeType: (value: InterviewSessionType) => void;
  onChangeDifficulty: (value: InterviewDifficulty) => void;
}

export function InterviewSetupForm({
  profile,
  targetRole,
  type,
  difficulty,
  onChangeTargetRole,
  onChangeType,
  onChangeDifficulty,
}: InterviewSetupFormProps) {
  const theme = useTheme();
  const suggested = suggestDifficultyFromSkills(profile);

  return (
    <View style={styles.wrap}>
      <Input
        label="Poste visé"
        placeholder="Ex: Développeur Full-stack"
        value={targetRole}
        onChangeText={onChangeTargetRole}
      />

      <View style={styles.section}>
        <Text variant="label" color={theme.colors.text.secondary}>
          Type d'entretien
        </Text>
        <View style={styles.chips}>
          {INTERVIEW_TYPE_OPTIONS.map((option) => {
            const selected = type === option.id;
            return (
              <PressableScale key={option.id} scale={0.96} onPress={() => onChangeType(option.id)}>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? theme.colors.brand.primary : theme.colors.card.default,
                      borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                >
                  <Text variant="caption" color={selected ? '#FFFFFF' : theme.colors.text.secondary}>
                    {option.label}
                  </Text>
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="label" color={theme.colors.text.secondary}>
          Difficulté
          {suggested === difficulty ? ' · suggérée selon ton profil' : ''}
        </Text>
        <View style={styles.chips}>
          {INTERVIEW_DIFFICULTY_OPTIONS.map((option) => {
            const selected = difficulty === option.id;
            return (
              <PressableScale key={option.id} scale={0.96} onPress={() => onChangeDifficulty(option.id)}>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? theme.colors.brand.primary : theme.colors.card.default,
                      borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                >
                  <Text variant="caption" color={selected ? '#FFFFFF' : theme.colors.text.secondary}>
                    {option.label}
                  </Text>
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20 },
  section: { gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
