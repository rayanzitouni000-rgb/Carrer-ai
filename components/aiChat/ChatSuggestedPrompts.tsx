import { ScrollView, StyleSheet, View } from 'react-native';

import { PressableScale, Text, useTheme } from '@/design-system';
import { SUGGESTED_PROMPTS } from '@/data/mockAiChatResponses';

export interface ChatSuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function ChatSuggestedPrompts({ onSelect, disabled }: ChatSuggestedPromptsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="caption" color={theme.colors.text.muted}>
        Suggestions
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SUGGESTED_PROMPTS.map((prompt) => (
          <PressableScale
            key={prompt}
            scale={0.96}
            onPress={() => onSelect(prompt)}
            disabled={disabled}
          >
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: theme.colors.card.elevated,
                  borderColor: theme.colors.border.subtle,
                  borderRadius: theme.radius.full,
                  opacity: disabled ? 0.55 : 1,
                },
              ]}
            >
              <Text variant="caption" color={theme.colors.text.primary}>
                {prompt}
              </Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  scroll: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    maxWidth: 280,
  },
});
