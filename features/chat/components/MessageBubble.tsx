import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AnimatedAIOrb, Text, useTheme } from '@/design-system';

import { ChatMessage } from '../constants/mockData';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  const entering = isUser
    ? FadeInUp.delay(index * 40).duration(350).springify()
    : FadeInDown.delay(index * 40).duration(350).springify();

  if (isUser) {
    return (
      <Animated.View entering={entering} style={[styles.row, styles.rowUser]}>
        <LinearGradient
          colors={[...theme.colors.brand.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.bubble,
            styles.userBubble,
            { borderBottomRightRadius: theme.radius.xs },
          ]}
        >
          <Text variant="bodySmall" color="#FFFFFF" style={styles.messageText}>
            {message.content}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.65)" style={styles.time}>
            {message.timestamp}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={entering} style={[styles.row, styles.rowAi]}>
      <AnimatedAIOrb size={32} />
      <View
        style={[
          styles.bubble,
          styles.aiBubble,
          theme.shadows.sm,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderBottomLeftRadius: theme.radius.xs,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text variant="bodySmall" color={theme.colors.text.primary} style={styles.messageText}>
          {message.content}
        </Text>
        <Text variant="caption" color={theme.colors.text.muted} style={styles.time}>
          {message.timestamp}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '100%',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAi: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    borderRadius: 18,
  },
  aiBubble: {
    borderWidth: 1,
    flex: 0,
  },
  messageText: {
    lineHeight: 22,
  },
  time: {
    marginTop: 6,
    alignSelf: 'flex-end',
  },
});
