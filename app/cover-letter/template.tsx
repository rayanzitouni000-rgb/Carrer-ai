import { StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import {
  Input,
  OutlineButton,
  PressableScale,
  PrimaryButton,
  ScreenContainer,
  Text,
  useTheme,
} from '@/design-system';
import {
  CLOSING_OPTIONS,
  INTRO_OPTIONS,
  MOTIVATION_OPTIONS,
} from '@/data/coverLetterTemplates';
import { useCoverLetterGenerator } from '@/hooks/useCoverLetterGenerator';
import type { CoverLetterPhraseOption } from '@/types/coverLetter';

interface PhraseSectionProps {
  title: string;
  options: CoverLetterPhraseOption[];
  selectedId: string | null;
  value: string;
  onSelectOption: (optionId: string) => void;
  onChangeText: (value: string) => void;
}

function PhraseSection({
  title,
  options,
  selectedId,
  value,
  onSelectOption,
  onChangeText,
}: PhraseSectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        {title}
      </Text>

      <View style={styles.options}>
        {options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <PressableScale key={option.id} scale={0.98} onPress={() => onSelectOption(option.id)}>
              <View
                style={[
                  styles.option,
                  {
                    backgroundColor: selected
                      ? 'rgba(43, 108, 255, 0.12)'
                      : theme.colors.card.elevated,
                    borderColor: selected
                      ? theme.colors.brand.primaryLight
                      : theme.colors.border.subtle,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: selected
                        ? theme.colors.brand.primaryLight
                        : theme.colors.border.default,
                    },
                  ]}
                >
                  {selected && (
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: theme.colors.brand.primaryLight },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.optionText}>
                  <Text variant="label" color={theme.colors.text.primary}>
                    {option.label}
                  </Text>
                  <Text variant="caption" color={theme.colors.text.secondary}>
                    {option.template}
                  </Text>
                </View>
              </View>
            </PressableScale>
          );
        })}
      </View>

      <Input
        label="Texte de la section"
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        style={styles.textArea}
      />
    </View>
  );
}

export default function CoverLetterTemplateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    data,
    selectedIntroId,
    selectedMotivationId,
    selectedClosingId,
    setIntroOption,
    setMotivationOption,
    setClosingOption,
    updateField,
  } = useCoverLetterGenerator();

  const canPreview =
    data.introText.trim().length > 0 &&
    data.motivationText.trim().length > 0 &&
    data.closingText.trim().length > 0;

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Modèle guidé">
      <View
        style={[
          styles.context,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text variant="caption" color={theme.colors.text.muted}>
          Candidature pour
        </Text>
        <Text variant="label" color={theme.colors.text.primary}>
          {data.jobTitle || 'Poste'} — {data.company || 'Entreprise'}
        </Text>
      </View>

      <PhraseSection
        title="Introduction"
        options={INTRO_OPTIONS}
        selectedId={selectedIntroId}
        value={data.introText}
        onSelectOption={setIntroOption}
        onChangeText={(value) => updateField('introText', value)}
      />

      <PhraseSection
        title="Motivation"
        options={MOTIVATION_OPTIONS}
        selectedId={selectedMotivationId}
        value={data.motivationText}
        onSelectOption={setMotivationOption}
        onChangeText={(value) => updateField('motivationText', value)}
      />

      <PhraseSection
        title="Clôture"
        options={CLOSING_OPTIONS}
        selectedId={selectedClosingId}
        value={data.closingText}
        onSelectOption={setClosingOption}
        onChangeText={(value) => updateField('closingText', value)}
      />

      <PrimaryButton
        label="Générer l'aperçu"
        fullWidth
        disabled={!canPreview}
        onPress={() => router.push('/cover-letter/preview' as Href)}
      />
      <OutlineButton label="Retour" fullWidth onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  context: {
    borderWidth: 1,
    padding: 14,
    gap: 4,
    marginBottom: 8,
  },
  section: { gap: 12 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderWidth: 1,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionText: { flex: 1, gap: 4 },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
});
