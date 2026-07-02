import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/design-system';

const CHAR_DELAY_MS = 35;
const END_DELAY_MS = 300;

interface AiSpeechBubbleProps {
  message: string;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

export function AiSpeechBubble({ message, onTypingStart, onTypingEnd }: AiSpeechBubbleProps) {
  const theme = useTheme();
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);

    setDisplayedText('');
    if (!message) return;

    onTypingStart?.();

    let index = 0;
    intervalRef.current = setInterval(() => {
      index += 1;
      setDisplayedText(message.slice(0, index));

      if (index >= message.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        endTimeoutRef.current = setTimeout(() => {
          onTypingEnd?.();
        }, END_DELAY_MS);
      }
    }, CHAR_DELAY_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
    };
  }, [message, onTypingStart, onTypingEnd]);

  if (!message) return null;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text variant="body" color={theme.colors.text.primary}>
          {displayedText}
        </Text>
      </View>
      <View
        style={[
          styles.tail,
          {
            borderTopColor: theme.colors.card.elevated,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  tail: {
    alignSelf: 'flex-start',
    marginLeft: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
