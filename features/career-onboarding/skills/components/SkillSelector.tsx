import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Input, OutlineButton, Text, useTheme } from '@/design-system';

import type { CareerProfile } from '../../types';
import { getAllSkills } from '../skillUtils';
import { SKILL_CATEGORIES_ORDER } from '../skills-data';
import { MIN_USER_SKILLS, SKILL_CATEGORY_LABELS, SkillCategory } from '../types';
import { useSkillSelector } from '../hooks/useSkillSelector';
import { SkillChip } from './SkillChip';
import { SkillLevelPopover } from './SkillLevelPopover';

interface SkillSelectorProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function SkillSelector({ profile, onChange }: SkillSelectorProps) {
  const theme = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SKILL_CATEGORIES_ORDER.map((category) => [category, true]))
  );

  const {
    userSkills,
    customSkills,
    suggestedSet,
    activeSkillId,
    customSkillLabel,
    setCustomSkillLabel,
    handleChipPress,
    upsertSkill,
    removeSkill,
    addCustomSkill,
    getUserSkill,
  } = useSkillSelector({ profile, onChange });

  const skillsByCategory = useMemo(() => {
    const allSkills = getAllSkills(customSkills);
    const grouped = new Map<SkillCategory, typeof allSkills>();

    SKILL_CATEGORIES_ORDER.forEach((category) => grouped.set(category, []));
    allSkills.forEach((skill) => {
      const list = grouped.get(skill.category) ?? [];
      list.push(skill);
      grouped.set(skill.category, list);
    });

    return grouped;
  }, [customSkills]);

  const toggleCategory = (category: SkillCategory) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const canAddCustom = customSkillLabel.trim().length > 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.text.primary}>
          Vos compétences
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Sélectionnez vos compétences et indiquez votre niveau pour personnaliser le matching,
          le CV et les entretiens IA.
        </Text>
        <Text variant="label" color={theme.colors.brand.primary}>
          {userSkills.length} compétence{userSkills.length > 1 ? 's' : ''} sélectionnée
          {userSkills.length > 1 ? 's' : ''}
          {userSkills.length < MIN_USER_SKILLS
            ? ` · minimum ${MIN_USER_SKILLS}`
            : ' · prêt à continuer'}
        </Text>
      </View>

      {SKILL_CATEGORIES_ORDER.map((category) => {
        const skills = skillsByCategory.get(category) ?? [];
        if (skills.length === 0) return null;

        const expanded = expandedCategories[category] ?? true;

        return (
          <Card key={category} variant="elevated" padding="4" style={styles.categoryCard}>
            <Pressable
              onPress={() => toggleCategory(category)}
              style={styles.categoryHeader}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              accessibilityLabel={`Catégorie ${SKILL_CATEGORY_LABELS[category]}`}
            >
              <Text variant="label" color={theme.colors.text.primary}>
                {SKILL_CATEGORY_LABELS[category]}
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                {expanded ? '▾' : '▸'} {skills.length}
              </Text>
            </Pressable>

            {expanded && (
              <View style={styles.chipGrid}>
                {skills.map((skill) => {
                  const userSkill = getUserSkill(skill.id);
                  const isPending = activeSkillId === skill.id && !userSkill;

                  return (
                    <View key={skill.id} style={styles.chipItem}>
                      <SkillChip
                        skill={skill}
                        userSkill={userSkill}
                        isSuggested={suggestedSet.has(skill.id)}
                        isPending={isPending}
                        onPress={() => handleChipPress(skill.id)}
                        onRemove={userSkill ? () => removeSkill(skill.id) : undefined}
                      />
                      {activeSkillId === skill.id && (
                        <SkillLevelPopover
                          selectedLevel={userSkill?.level}
                          onSelect={(level) => upsertSkill(skill.id, level)}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </Card>
        );
      })}

      <Card variant="elevated" padding="5" style={styles.customCard}>
        <Text variant="label" color={theme.colors.text.secondary}>
          Autre compétence
        </Text>
        <Input
          placeholder="Ex. Gestion de crise, Figma, Excel avancé..."
          value={customSkillLabel}
          onChangeText={setCustomSkillLabel}
          onSubmitEditing={addCustomSkill}
          returnKeyType="done"
        />
        <OutlineButton
          label="Ajouter la compétence"
          onPress={addCustomSkill}
          disabled={!canAddCustom}
          fullWidth
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    gap: 8,
  },
  categoryCard: {
    gap: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipItem: {
    width: '48.5%',
    flexGrow: 1,
    gap: 8,
  },
  customCard: {
    gap: 12,
    marginTop: 4,
  },
});
