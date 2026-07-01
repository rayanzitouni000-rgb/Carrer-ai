import { StyleSheet, View } from 'react-native';

import { Card, Input, Text, useTheme } from '@/design-system';

import { AGE_OPTIONS } from '../constants';
import { ChipSelector } from './SelectableOptionCard';
import type { CareerProfile } from '../types';

interface PersonalInfoStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function PersonalInfoStep({ profile, onChange }: PersonalInfoStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="h2" color={theme.colors.text.primary}>
        Informations personnelles
      </Text>
      <Text variant="body" color={theme.colors.text.secondary}>
        Commençons par les bases.
      </Text>

      <Card variant="elevated" padding="5" style={styles.card}>
        <Input
          label="Prénom"
          placeholder="Ton prénom"
          value={profile.firstName}
          onChangeText={(firstName) => onChange({ firstName })}
          autoCapitalize="words"
        />

        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Âge
          </Text>
          <ChipSelector
            options={AGE_OPTIONS}
            selected={profile.ageRange}
            onSelect={(ageRange) => onChange({ ageRange })}
          />
        </View>
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
