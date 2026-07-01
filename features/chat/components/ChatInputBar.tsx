import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Icon, PressableScale, useTheme } from '@/design-system';

interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInputBar({ value, onChangeText, onSend, disabled }: ChatInputBarProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.wrapper}>
      <View
        style={[
          styles.bar,
          theme.shadows.md,
          {
            backgroundColor: theme.colors.card.default,
            borderColor: focused ? theme.colors.brand.primary : theme.colors.border.subtle,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        <PressableScale scale={0.9}>
          <View style={[styles.iconBtn, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.full }]}>
            <Icon name="attach-outline" size="sm" color={theme.colors.text.muted} />
          </View>
        </PressableScale>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Ask your AI Career Coach..."
          placeholderTextColor={theme.colors.text.muted}
          style={[theme.typography.body, styles.input, { color: theme.colors.text.primary }]}
          multiline
          maxLength={500}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          onSubmitEditing={canSend ? onSend : undefined}
        />

        <PressableScale scale={0.9}>
          <View style={[styles.iconBtn, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.full }]}>
            <Icon name="mic-outline" size="sm" color={theme.colors.text.muted} />
          </View>
        </PressableScale>

        <PressableScale scale={0.92} onPress={onSend} disabled={!canSend}>
          <LinearGradient
            colors={canSend ? [...theme.colors.brand.gradient] : ['#334155', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.sendBtn, { borderRadius: theme.radius.full }]}
          >
            <Icon name="send" size="sm" color="#FFFFFF" />
          </LinearGradient>
        </PressableScale>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingTop: 4 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1.5,
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
