import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Edit3, Sparkles } from 'lucide-react-native';

import { CompanyBriefCard } from '@/components/interview';
import { AiFormSelect } from '@/components/onboarding/AiFormSelect';
import { PaywallScreen, PremiumBadge } from '@/components/premium';
import {
  Icon,
  Input,
  LoadingSpinner,
  PressableScale,
  PrimaryButton,
  Text,
  useTheme,
  useToast,
} from '@/design-system';
import { QUOTA_EXCEEDED_MESSAGE } from '@/constants/apiConfig';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import { fetchCompanyBrief } from '@/services/companyBriefApi';
import type { CompanyBriefing } from '@/types/interviewSimulator';
import type { SelectOption } from '@/types/onboarding';
import { formatShortInterviewDate } from '@/utils/interviewSimulatorUtils';

type FillMode = 'manual' | 'ai';

const FILL_MODE_OPTIONS: SelectOption[] = [
  { id: 'manual', label: 'Remplir manuellement', icon: Edit3 },
  { id: 'ai', label: "Générer avec l'IA (juste le nom)", icon: Sparkles },
];

export default function AddInterviewScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const { isPremium } = usePremiumStatus();
  const { addInterview } = useRealInterviews();

  const [fillMode, setFillMode] = useState<FillMode>('manual');
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [companyBriefing, setCompanyBriefing] = useState<CompanyBriefing | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const canSave = company.trim().length > 0 && jobTitle.trim().length > 0;
  const canGenerateBrief = company.trim().length > 0 && !isGeneratingBrief;

  const handleModeChange = (mode: string) => {
    setFillMode(mode as FillMode);
    setCompanyBriefing(null);
  };

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

  const handleGenerateBrief = async () => {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }

    setIsGeneratingBrief(true);
    setCompanyBriefing(null);

    const result = await fetchCompanyBrief(company.trim());
    setIsGeneratingBrief(false);

    if (!result.ok) {
      if (result.code === 'QUOTA_EXCEEDED') {
        toast.show({ type: 'warning', title: QUOTA_EXCEEDED_MESSAGE });
      } else {
        toast.show({
          type: 'error',
          title: result.message ?? 'Impossible de générer la fiche',
        });
      }
      return;
    }

    setCompanyBriefing(result.brief);
  };

  const handleSave = async () => {
    await addInterview({
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      scheduledAt: scheduledAt.toISOString(),
      notes: notes.trim() || undefined,
      companyBriefing: companyBriefing ?? undefined,
    });
    router.back();
  };

  const dateTimeFields = (
    <>
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

      <Input
        label="Notes (optionnel)"
        placeholder="Ex: entretien RH avec Marie, prévoir des exemples STAR..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notesInput}
      />
    </>
  );

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

        <AiFormSelect
          mode="single"
          label="Comment veux-tu ajouter cet entretien ?"
          options={FILL_MODE_OPTIONS}
          selectedId={fillMode}
          onSelect={handleModeChange}
        />

        {fillMode === 'manual' ? (
          <>
            <Input label="Entreprise" placeholder="Ex: Doctolib" value={company} onChangeText={setCompany} />
            <Input label="Poste" placeholder="Ex: Product Designer" value={jobTitle} onChangeText={setJobTitle} />
            {dateTimeFields}
          </>
        ) : (
          <>
            <View style={styles.aiHeaderRow}>
              <Input
                label="Nom de l'entreprise"
                placeholder="Ex: Capgemini"
                value={company}
                onChangeText={(text) => {
                  setCompany(text);
                  setCompanyBriefing(null);
                }}
              />
              <PremiumBadge />
            </View>

            <PrimaryButton
              label={isGeneratingBrief ? 'Génération en cours...' : '✨ Générer la fiche'}
              fullWidth
              disabled={!canGenerateBrief}
              onPress={() => void handleGenerateBrief()}
            />

            {isGeneratingBrief && (
              <View style={styles.loaderRow}>
                <LoadingSpinner />
                <Text variant="bodySmall" color={theme.colors.text.secondary}>
                  L&apos;IA prépare la fiche entreprise (2-5 s)...
                </Text>
              </View>
            )}

            {companyBriefing && (
              <CompanyBriefCard companyName={company.trim()} briefing={companyBriefing} />
            )}

            <Input label="Poste" placeholder="Ex: Product Designer" value={jobTitle} onChangeText={setJobTitle} />
            {dateTimeFields}
          </>
        )}

        <PrimaryButton label="Enregistrer" fullWidth disabled={!canSave} onPress={() => void handleSave()} />
      </ScrollView>

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="company_brief"
        onClose={() => setPaywallVisible(false)}
      />
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
  aiHeaderRow: { gap: 8 },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  notesInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
