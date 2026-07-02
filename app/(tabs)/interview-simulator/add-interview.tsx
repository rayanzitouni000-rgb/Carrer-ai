import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Input, PressableScale, PrimaryButton, Text, useTheme } from '@/design-system';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import { formatShortInterviewDate } from '@/utils/interviewSimulatorUtils';

export default function AddInterviewScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addInterview } = useRealInterviews();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const canSave = company.trim().length > 0 && jobTitle.trim().length > 0;

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (!selected) return;
    setScheduledAt((prev) => {
      const next = new Date(prev);
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      return next;
    });
  };

  const handleTimeChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (!selected) return;
    setScheduledAt((prev) => {
      const next = new Date(prev);
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      return next;
    });
  };

  const handleSave = async () => {
    await addInterview({
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      scheduledAt: scheduledAt.toISOString(),
    });
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: theme.spacing['4'],
          gap: 20,
        }}
      >
        <View style={styles.headerRow}>
          <PressableScale scale={0.92} onPress={() => router.back()}>
            <View
              style={[
                styles.backBtn,
                { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full },
              ]}
            >
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
          <Text variant="h2" color={theme.colors.text.primary}>
            Ajouter un entretien
          </Text>
          <View style={styles.backBtn} />
        </View>

        <Input label="Entreprise" placeholder="Ex: Doctolib" value={company} onChangeText={setCompany} />
        <Input label="Poste" placeholder="Ex: Product Designer" value={jobTitle} onChangeText={setJobTitle} />

        <View style={styles.dateSection}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Date et heure
          </Text>
          <View style={styles.dateRow}>
            <Pressable
              style={[
                styles.dateBtn,
                {
                  backgroundColor: theme.colors.card.elevated,
                  borderColor: theme.colors.border.subtle,
                  borderRadius: theme.radius.md,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-outline" size="sm" color={theme.colors.brand.primaryLight} />
              <Text variant="bodySmall" color={theme.colors.text.primary}>
                {formatShortInterviewDate(scheduledAt.toISOString())}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dateBtn,
                {
                  backgroundColor: theme.colors.card.elevated,
                  borderColor: theme.colors.border.subtle,
                  borderRadius: theme.radius.md,
                },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon name="time-outline" size="sm" color={theme.colors.brand.primaryLight} />
              <Text variant="bodySmall" color={theme.colors.text.primary}>
                {scheduledAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={scheduledAt}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={scheduledAt}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <PrimaryButton label="Enregistrer" fullWidth disabled={!canSave} onPress={() => void handleSave()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSection: { gap: 8 },
  dateRow: { flexDirection: 'row', gap: 10 },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
});
