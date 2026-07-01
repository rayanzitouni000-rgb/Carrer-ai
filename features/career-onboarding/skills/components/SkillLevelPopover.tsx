import Animated, { FadeIn } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { Text, useTheme } from '@/design-system';

import type { SkillLevel } from '../types';
import { SKILL_LEVEL_CONFIG } from '../types';

const LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'expert'];

interface SkillLevelPopoverProps {
  selectedLevel?: SkillLevel;
  onSelect: (level: SkillLevel) => void;
  onClose: () => void;
}

export function SkillLevelPopover({ selectedLevel, onSelect, onClose }: SkillLevelPopoverProps) {
  const theme = useTheme();

  const handleSelect = (level: SkillLevel) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(level);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card.elevated,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
        },
      ]}
      accessibilityRole="radiogroup"
      accessibilityLabel="Choisir le niveau de compétence"
    >
      {LEVELS.map((level) => {
        const config = SKILL_LEVEL_CONFIG[level];
        const active = selectedLevel === level;

        return (
          <Pressable
            key={level}
            onPress={() => handleSelect(level)}
            style={[
              styles.option,
              {
                backgroundColor: active ? 'rgba(59, 130, 246, 0.12)' : theme.colors.card.default,
                borderColor: active ? config.color : theme.colors.border.subtle,
                borderRadius: theme.radius.md,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${config.label}, ${config.description}`}
          >
            <Text variant="label" color={active ? config.color : theme.colors.text.primary}>
              {config.label}
            </Text>
            <Text variant="caption" color={theme.colors.text.muted}>
              {config.description}
            </Text>
          </Pressable>
        );
      })}

      <Pressable onPress={onClose} style={styles.cancel} accessibilityRole="button" accessibilityLabel="Fermer">
        <Text variant="caption" color={theme.colors.text.muted}>
          Annuler
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 4,
  },
  cancel: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
});
