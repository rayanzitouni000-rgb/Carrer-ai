import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { PressableScale, Text, useTheme } from '@/design-system';

import { SUGGESTED_PROMPTS } from '../constants/mockData';

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {SUGGESTED_PROMPTS.map((prompt, index) => (
        <Animated.View
          key={prompt.id}
          entering={FadeInRight.delay(150 + index * 60).duration(400).springify()}
        >
          <PressableScale
            scale={0.95}
            onPress={() => onSelect(prompt.label)}
            disabled={disabled}
          >
            <Animated.View
              style={[
                styles.chip,
                {
                  backgroundColor: theme.colors.card.elevated,
                  borderColor: theme.colors.border.subtle,
                  borderRadius: theme.radius.full,
                  opacity: disabled ? 0.5 : 1,
                },
              ]}
            >
              <Text variant="caption" color={theme.colors.text.primary} style={styles.chipText}>
                {prompt.label}
              </Text>
            </Animated.View>
          </PressableScale>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chipText: { fontWeight: '600' },
});
