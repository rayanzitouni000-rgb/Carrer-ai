import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useMemo, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { AiStepHeader } from '@/components/aiCharacter';
import { Card, Icon, Input, Text, useTheme } from '@/design-system';
import {
  formatDateOfBirthLabel,
  getDefaultDateOfBirth,
  getMaxDateOfBirth,
  getMinDateOfBirth,
  parseISODate,
  toISODate,
} from '@/utils/dateUtils';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import type { CareerProfile } from '../types';

interface PersonalInfoStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function PersonalInfoStep({ profile, onChange }: PersonalInfoStepProps) {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const birthDate = useMemo(() => {
    if (profile.dateOfBirth) return parseISODate(profile.dateOfBirth);
    return parseISODate(getDefaultDateOfBirth());
  }, [profile.dateOfBirth]);

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (!selected) return;
    onChange({ dateOfBirth: toISODate(selected) });
  };

  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.personal ?? ''} />

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
            Date de naissance
          </Text>
          <Pressable
            style={[
              styles.dateBtn,
              {
                backgroundColor: theme.colors.card.default,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.md,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar-outline" size="sm" color={theme.colors.brand.primaryLight} />
            <Text variant="bodySmall" color={theme.colors.text.primary}>
              {profile.dateOfBirth
                ? formatDateOfBirthLabel(profile.dateOfBirth)
                : 'Sélectionner une date'}
            </Text>
          </Pressable>
        </View>
      </Card>

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={getMinDateOfBirth()}
          maximumDate={getMaxDateOfBirth()}
          onChange={handleDateChange}
        />
      )}
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
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
  },
});
