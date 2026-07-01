import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/design-system';

import type { Skill, SkillLevel, UserSkill } from '../types';
import { SKILL_LEVEL_CONFIG } from '../types';
import { SkillLevelPopover } from './SkillLevelPopover';

interface SelectedSkillRowProps {
  userSkill: UserSkill;
  isActive: boolean;
  onOpenLevelPicker: (skill: Skill) => void;
  onConfirmLevel: (level: SkillLevel) => void;
  onCloseLevelPicker: () => void;
  onRemove: (skillId: string) => void;
}

export function SelectedSkillRow({
  userSkill,
  isActive,
  onOpenLevelPicker,
  onConfirmLevel,
  onCloseLevelPicker,
  onRemove,
}: SelectedSkillRowProps) {
  const theme = useTheme();
  const levelConfig = SKILL_LEVEL_CONFIG[userSkill.level];

  const skill: Skill = {
    id: userSkill.id,
    label: userSkill.label,
    category: userSkill.category,
  };

  const accessibilityLabel = `${userSkill.label}, niveau ${levelConfig.label}. Appuie deux fois pour modifier le niveau.`;

  return (
    <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(150)}>
      <View style={[styles.row, { borderColor: theme.colors.border.subtle, borderRadius: theme.radius.md }]}>
        <Text variant="label" color={theme.colors.text.primary} style={styles.label}>
          {userSkill.label}
        </Text>

        <Pressable
          onPress={() => onOpenLevelPicker(skill)}
          style={[
            styles.levelBadge,
            {
              backgroundColor: `${levelConfig.color}22`,
              borderColor: levelConfig.color,
              borderRadius: theme.radius.full,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
        >
          <Text variant="caption" color={levelConfig.color}>
            {levelConfig.label}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onRemove(userSkill.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Retirer ${userSkill.label}`}
        >
          <Text variant="caption" color={theme.colors.text.muted}>
            ✕
          </Text>
        </Pressable>
      </View>

      {isActive && (
        <SkillLevelPopover
          selectedLevel={userSkill.level}
          onSelect={onConfirmLevel}
          onClose={onCloseLevelPicker}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  label: {
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
});
