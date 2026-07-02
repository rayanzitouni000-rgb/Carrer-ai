import { useCallback } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { Card, Input, OutlineButton, Text, useTheme } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';

import type { CareerProfile, WorkExperience } from '../types';

const MAX_EXPERIENCES = 5;

function createExperience(): WorkExperience {
  return {
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    jobTitle: '',
    company: '',
    duration: '',
    isCurrent: false,
  };
}

interface ExperienceStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function ExperienceStep({ profile, onChange }: ExperienceStepProps) {
  const theme = useTheme();

  const experiences =
    (profile.experiences ?? []).length > 0 ? profile.experiences : [createExperience()];

  const updateExperiences = useCallback(
    (next: WorkExperience[]) => {
      onChange({ experiences: next });
    },
    [onChange]
  );

  const handleNoExperienceToggle = (value: boolean) => {
    onChange({
      hasNoExperience: value,
      experiences: value ? [] : [createExperience()],
    });
  };

  const updateExperience = (id: string, patch: Partial<WorkExperience>) => {
    updateExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, ...patch } : exp))
    );
  };

  const removeExperience = (id: string) => {
    const next = experiences.filter((exp) => exp.id !== id);
    updateExperiences(next.length > 0 ? next : [createExperience()]);
  };

  const addExperience = () => {
    if (experiences.length >= MAX_EXPERIENCES) return;
    updateExperiences([...experiences, createExperience()]);
  };

  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.experience ?? ''} />

      <Card variant="elevated" padding="5" style={styles.card}>
        <View style={styles.toggleRow}>
          <Text variant="label" color={theme.colors.text.primary} style={styles.toggleLabel}>
            Je n&apos;ai pas encore d&apos;expérience professionnelle
          </Text>
          <Switch
            value={profile.hasNoExperience}
            onValueChange={handleNoExperienceToggle}
            trackColor={{ false: theme.colors.border.subtle, true: theme.colors.brand.primary }}
          />
        </View>

        {!profile.hasNoExperience && (
          <View style={styles.experiences}>
            {experiences.map((exp, index) => (
              <View
                key={exp.id}
                style={[
                  styles.experienceBlock,
                  { borderColor: theme.colors.border.subtle, borderRadius: theme.radius.lg },
                ]}
              >
                <View style={styles.experienceHeader}>
                  <Text variant="label" color={theme.colors.text.secondary}>
                    Expérience {index + 1}
                  </Text>
                  {experiences.length > 1 && (
                    <Pressable onPress={() => removeExperience(exp.id)} hitSlop={8}>
                      <Text variant="caption" color={theme.colors.text.muted}>
                        ✕
                      </Text>
                    </Pressable>
                  )}
                </View>

                <Input
                  label="Intitulé du poste"
                  placeholder="Ex. Assistant commercial"
                  value={exp.jobTitle}
                  onChangeText={(jobTitle) => updateExperience(exp.id, { jobTitle })}
                />
                <Input
                  label="Entreprise"
                  placeholder="Ex. Carrefour, SNCF..."
                  value={exp.company}
                  onChangeText={(company) => updateExperience(exp.id, { company })}
                />
                <Input
                  label="Durée"
                  placeholder='Ex. 2 ans ou "Jan 2022 - Déc 2023"'
                  value={exp.duration}
                  onChangeText={(duration) => updateExperience(exp.id, { duration })}
                />

                <View style={styles.toggleRow}>
                  <Text variant="caption" color={theme.colors.text.secondary}>
                    Poste actuel
                  </Text>
                  <Switch
                    value={exp.isCurrent}
                    onValueChange={(isCurrent) => updateExperience(exp.id, { isCurrent })}
                    trackColor={{
                      false: theme.colors.border.subtle,
                      true: theme.colors.brand.primary,
                    }}
                  />
                </View>
              </View>
            ))}

            {experiences.length < MAX_EXPERIENCES && (
              <OutlineButton
                label="+ Ajouter une autre expérience"
                onPress={addExperience}
                fullWidth
              />
            )}
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    gap: 16,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleLabel: {
    flex: 1,
  },
  experiences: {
    gap: 16,
  },
  experienceBlock: {
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
