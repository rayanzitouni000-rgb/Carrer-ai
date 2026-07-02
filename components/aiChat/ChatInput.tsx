import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send } from 'lucide-react-native';

import { PressableScale, Text, useTheme } from '@/design-system';

export interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const canSend = !disabled && text.trim().length > 0;

  const handleSend = () => {
    const trimmed = text.trim();
    if (disabled) {
      onSend(trimmed);
      return;
    }
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.bar,
          theme.shadows.sm,
          {
            backgroundColor: theme.colors.card.default,
            borderColor: focused ? theme.colors.brand.primary : theme.colors.border.subtle,
            borderRadius: theme.radius.xl,
          },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Écris ton message..."
          placeholderTextColor={theme.colors.text.muted}
          style={[theme.typography.body, styles.input, { color: theme.colors.text.primary }]}
          multiline
          maxLength={500}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel="Champ de saisie du message"
          accessibilityHint="Saisis ta question pour le coach IA"
        />

        <PressableScale scale={0.92} onPress={handleSend} disabled={!disabled && !canSend}>
          <LinearGradient
            colors={disabled || canSend ? [...theme.colors.brand.gradient] : ['#334155', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.sendBtn, { borderRadius: theme.radius.full }]}
          >
            <Send size={18} color="#FFFFFF" />
          </LinearGradient>
        </PressableScale>
      </View>

      {disabled && (
        <Text variant="caption" color={theme.colors.status.warning} style={styles.limitHint}>
          Limite quotidienne atteinte — passe en Premium pour continuer
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1.5,
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 96,
    minHeight: 40,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitHint: {
    paddingHorizontal: 4,
  },
});
