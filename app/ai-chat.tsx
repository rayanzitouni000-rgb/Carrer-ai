import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingSpinner, Text, useTheme } from '@/design-system';
import {
  ChatHeader,
  ChatInput,
  ChatMessageBubble,
  ChatSuggestedPrompts,
  ChatTypingIndicator,
} from '@/components/aiChat';
import { PaywallScreen } from '@/components/premium';
import { useAiChat } from '@/hooks/useAiChat';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { FREE_CHAT_MESSAGES_PER_DAY } from '@/types/premium';
import type { ChatMessage } from '@/types/aiChat';

export default function AiChatScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const { isPremium } = usePremiumStatus();
  const { chatMessagesToday } = useUsageLimits();
  const { messages, isTyping, isReady, canSendMessage, sendMessage } = useAiChat();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    scrollToBottom();
  }, [isReady, messages.length, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    (text: string) => {
      if (!canSendMessage) {
        setPaywallVisible(true);
        return;
      }
      if (!text.trim() || isTyping) return;
      sendMessage(text);
    },
    [canSendMessage, isTyping, sendMessage]
  );

  const showSuggestedPrompts = messages.length <= 1;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <LinearGradient
        colors={['rgba(6, 182, 212, 0.1)', 'rgba(59, 130, 246, 0.06)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.35 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top + 8,
              paddingBottom: insets.bottom + 12,
              paddingHorizontal: theme.spacing['4'],
            },
          ]}
        >
          <ChatHeader />

          <View style={styles.messagesArea}>
            {!isReady ? (
              <View style={styles.loading}>
                <LoadingSpinner />
              </View>
            ) : (
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ChatMessageBubble message={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={scrollToBottom}
                ListFooterComponent={isTyping ? <ChatTypingIndicator /> : null}
              />
            )}
          </View>

          {isReady && showSuggestedPrompts && (
            <ChatSuggestedPrompts onSelect={handleSend} disabled={isTyping} />
          )}

          {!isPremium && isReady && (
            <Text variant="caption" color={theme.colors.text.muted} align="center">
              {chatMessagesToday}/{FREE_CHAT_MESSAGES_PER_DAY} messages aujourd&apos;hui
            </Text>
          )}

          <ChatInput onSend={handleSend} disabled={!canSendMessage || isTyping} />
        </View>
      </KeyboardAvoidingView>

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="chat_limit"
        onClose={() => setPaywallVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    gap: 12,
  },
  messagesArea: {
    flex: 1,
    minHeight: 120,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
