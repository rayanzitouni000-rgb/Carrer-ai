import { Pressable, StyleSheet, View } from 'react-native';

import { PressableScale, Text, useTheme } from '@/design-system';

import { Skill, SkillLevel, SKILL_LEVEL_LABELS, UserSkill } from '../types';

interface SkillChipProps {
  skill: Skill;
  userSkill?: UserSkill;
  isSuggested?: boolean;
  isPending?: boolean;
  onPress: () => void;
  onRemove?: () => void;
}

function getLevelStyles(level: SkillLevel, theme: ReturnType<typeof useTheme>) {
  switch (level) {
    case SkillLevel.BEGINNER:
      return {
        backgroundColor: theme.colors.card.elevated,
        borderColor: theme.colors.border.default,
        textColor: theme.colors.text.secondary,
      };
    case SkillLevel.INTERMEDIATE:
      return {
        backgroundColor: 'rgba(43, 108, 255, 0.14)',
        borderColor: theme.colors.brand.primary,
        textColor: theme.colors.brand.primary,
      };
    case SkillLevel.EXPERT:
      return {
        backgroundColor: 'rgba(37, 99, 235, 0.28)',
        borderColor: '#1D4ED8',
        textColor: theme.colors.text.primary,
      };
    default:
      return {
        backgroundColor: theme.colors.card.default,
        borderColor: theme.colors.border.subtle,
        textColor: theme.colors.text.secondary,
      };
  }
}

export function SkillChip({
  skill,
  userSkill,
  isSuggested = false,
  isPending = false,
  onPress,
  onRemove,
}: SkillChipProps) {
  const theme = useTheme();
  const isSelected = Boolean(userSkill) || isPending;

  const levelStyle = userSkill
    ? getLevelStyles(userSkill.level, theme)
    : {
        backgroundColor: isPending ? 'rgba(43, 108, 255, 0.08)' : theme.colors.card.default,
        borderColor: isPending ? theme.colors.brand.primary : theme.colors.border.subtle,
        textColor: theme.colors.text.secondary,
      };

  const levelLabel = userSkill ? SKILL_LEVEL_LABELS[userSkill.level] : 'non défini';
  const accessibilityLabel = isSelected
    ? `${skill.label}, niveau ${levelLabel}, sélectionné`
    : `${skill.label}, non sélectionné`;

  return (
    <PressableScale onPress={onPress} scale={0.96}>
      <View
        style={[
          styles.chip,
          {
            borderRadius: theme.radius.lg,
            backgroundColor: levelStyle.backgroundColor,
            borderColor: levelStyle.borderColor,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.row}>
          {skill.emoji ? <Text variant="body">{skill.emoji}</Text> : null}
          <View style={styles.textWrap}>
            <Text variant="caption" color={levelStyle.textColor} numberOfLines={2}>
              {skill.label}
            </Text>
            {userSkill && (
              <Text variant="caption" color={theme.colors.text.muted}>
                {SKILL_LEVEL_LABELS[userSkill.level]}
              </Text>
            )}
          </View>
          {userSkill && onRemove ? (
            <Pressable
              onPress={onRemove}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Retirer ${skill.label}`}
            >
              <Text variant="caption" color={theme.colors.text.muted}>
                ✕
              </Text>
            </Pressable>
          ) : null}
        </View>

        {isSuggested && (
          <View
            style={[
              styles.suggestedBadge,
              {
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                borderRadius: theme.radius.full,
              },
            ]}
          >
            <Text variant="caption" color={theme.colors.brand.accent}>
              Suggéré ✨
            </Text>
          </View>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    minHeight: 52,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  suggestedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
