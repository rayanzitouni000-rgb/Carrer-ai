import { Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';

import { AiStepHeader } from '@/components/aiCharacter';
import { Input, Text, useTheme } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../../constants/aiCharacterMessages';

import { MIN_USER_SKILLS } from '../types';
import { useSkillSelector } from '../hooks/useSkillSelector';
import type { CareerProfile } from '../../types';
import { SelectedSkillRow } from './SelectedSkillRow';
import { SkillLevelPopover } from './SkillLevelPopover';

interface SkillsStepContentProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
  onRegisterScrollDismiss?: (handler: (() => void) | null) => void;
}

export function SkillsStepContent({
  profile,
  onChange,
  onRegisterScrollDismiss,
}: SkillsStepContentProps) {
  const theme = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestedSkills,
    selectedSkills,
    activeSkillId,
    pendingSkill,
    openLevelPicker,
    confirmLevel,
    closeLevelPicker,
    removeSkill,
    addCustomSkill,
  } = useSkillSelector({ profile, onChange });

  const trimmedQuery = searchQuery.trim();
  const showSearchPanel = trimmedQuery.length > 0;
  const isPendingNewSkill =
    pendingSkill != null && !selectedSkills.some((skill) => skill.id === pendingSkill.id);

  const handleScrollDismiss = () => {
    Keyboard.dismiss();
    closeLevelPicker();
  };

  useEffect(() => {
    const dismiss = () => {
      Keyboard.dismiss();
      closeLevelPicker();
    };
    onRegisterScrollDismiss?.(dismiss);
    return () => onRegisterScrollDismiss?.(null);
  }, [closeLevelPicker, onRegisterScrollDismiss]);

  return (
    <Pressable style={styles.container} onPress={closeLevelPicker}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.skills ?? ''} />

      <Pressable onPress={(event) => event.stopPropagation()}>
        <Input
          placeholder="Rechercher une compétence..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
          accessibilityHint="Recherche parmi plus de 30 compétences"
        />
      </Pressable>

      {showSearchPanel && (
        <Pressable onPress={(event) => event.stopPropagation()}>
          <View
            style={[
              styles.searchPanel,
              {
                backgroundColor: theme.colors.card.elevated,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            {searchResults.map((skill) => (
              <View key={skill.id}>
                <Pressable
                  onPress={() => openLevelPicker(skill)}
                  style={styles.searchRow}
                  accessibilityRole="button"
                  accessibilityLabel={`Ajouter ${skill.label}`}
                >
                  <Text variant="body" color={theme.colors.text.primary}>
                    {skill.label}
                  </Text>
                </Pressable>

                {activeSkillId === skill.id && (
                  <SkillLevelPopover
                    selectedLevel={undefined}
                    onSelect={confirmLevel}
                    onClose={closeLevelPicker}
                  />
                )}
              </View>
            ))}

            {searchResults.length === 0 && trimmedQuery.length > 1 && (
              <View>
                <Pressable
                  onPress={() => addCustomSkill(trimmedQuery)}
                  style={styles.searchRow}
                  accessibilityRole="button"
                  accessibilityLabel={`Ajouter ${trimmedQuery} comme nouvelle compétence`}
                >
                  <Text variant="body" color={theme.colors.brand.primary}>
                    + Ajouter « {trimmedQuery} » comme nouvelle compétence
                  </Text>
                </Pressable>

                {isPendingNewSkill && activeSkillId === pendingSkill?.id && (
                  <SkillLevelPopover
                    selectedLevel={undefined}
                    onSelect={confirmLevel}
                    onClose={closeLevelPicker}
                  />
                )}
              </View>
            )}
          </View>
        </Pressable>
      )}

      {!showSearchPanel && suggestedSkills.length > 0 && (
        <Pressable onPress={(event) => event.stopPropagation()}>
          <View style={styles.section}>
            <Text variant="label" color={theme.colors.text.secondary}>
              Suggestions pour toi ✨
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={handleScrollDismiss}
              contentContainerStyle={styles.suggestionRow}
            >
              {suggestedSkills.map((skill) => (
                <Pressable
                  key={skill.id}
                  onPress={() => openLevelPicker(skill)}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: theme.colors.card.default,
                      borderColor:
                        activeSkillId === skill.id
                          ? theme.colors.brand.primary
                          : theme.colors.border.subtle,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Suggestion : ${skill.label}`}
                >
                  <Text variant="caption" color={theme.colors.text.secondary}>
                    {skill.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {activeSkillId &&
              suggestedSkills.some((skill) => skill.id === activeSkillId) && (
              <SkillLevelPopover
                selectedLevel={
                  selectedSkills.find((skill) => skill.id === activeSkillId)?.level
                }
                onSelect={confirmLevel}
                onClose={closeLevelPicker}
              />
            )}
          </View>
        </Pressable>
      )}

      <Pressable onPress={(event) => event.stopPropagation()}>
        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.primary}>
            Tes compétences ({selectedSkills.length})
          </Text>

          {selectedSkills.length === 0 ? (
            <Text variant="caption" color={theme.colors.text.muted}>
              Aucune compétence sélectionnée pour le moment.
            </Text>
          ) : (
            <View style={styles.selectedList}>
              {selectedSkills.map((userSkill) => (
                <SelectedSkillRow
                  key={userSkill.id}
                  userSkill={userSkill}
                  isActive={activeSkillId === userSkill.id}
                  onOpenLevelPicker={openLevelPicker}
                  onConfirmLevel={confirmLevel}
                  onCloseLevelPicker={closeLevelPicker}
                  onRemove={removeSkill}
                />
              ))}
            </View>
          )}
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  searchPanel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  section: {
    gap: 10,
  },
  suggestionRow: {
    gap: 8,
    paddingVertical: 2,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  selectedList: {
    gap: 10,
  },
});
