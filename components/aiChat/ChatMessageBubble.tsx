import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, useTheme } from '@/design-system';
import { AiCharacterAvatar } from '@/components/aiCharacter';
import type { ChatMessage } from '@/types/aiChat';

import { formatChatTimestamp } from './formatChatTimestamp';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';
  const timeLabel = formatChatTimestamp(message.timestamp);
  const accessibilityLabel = isUser
    ? `Message de toi : ${message.content}`
    : `Message du coach IA : ${message.content}`;

  return (
    <View
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {!isUser && (
        <View style={styles.avatarWrap}>
          <AiCharacterAvatar state="idle" size="small" style={styles.miniAvatar} />
        </View>
      )}

      <View style={[styles.column, isUser ? styles.columnUser : styles.columnAssistant]}>
        {isUser ? (
          <LinearGradient
            colors={[...theme.colors.brand.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, { borderRadius: theme.radius.lg }]}
          >
            <Text variant="bodySmall" color="#FFFFFF">
              {message.content}
            </Text>
          </LinearGradient>
        ) : (
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
            <Text variant="bodySmall" color={theme.colors.text.primary}>
              {message.content}
            </Text>
          </View>
        )}

        {timeLabel ? (
          <Text
            variant="caption"
            color={theme.colors.text.muted}
            style={isUser ? styles.timeUser : styles.timeAssistant}
          >
            {timeLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    overflow: 'hidden',
  },
  miniAvatar: {
    transform: [{ scale: 0.75 }],
    marginLeft: -6,
    marginTop: -6,
  },
  column: {
    maxWidth: '82%',
    gap: 4,
  },
  columnUser: {
    alignItems: 'flex-end',
  },
  columnAssistant: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeUser: {
    paddingRight: 4,
  },
  timeAssistant: {
    paddingLeft: 4,
  },
});
