import { useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, PressableScale, useTheme } from '@/design-system';

import {
  ChatEmptyState,
  ChatHeader,
  ChatInputBar,
  ChatMessageList,
  SmartActions,
  SuggestedPrompts,
  WelcomeCard,
} from '@/features/chat/components';
import { MOCK_CONVERSATION } from '@/features/chat/constants/mockData';
import { useChat } from '@/features/chat/hooks';

export default function AiChatScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    isEmpty,
  } = useChat(MOCK_CONVERSATION);

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handlePrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <WelcomeCard />
        {isEmpty && <ChatEmptyState />}
      </View>
    ),
    [isEmpty]
  );

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
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
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
          <View style={styles.topBar}>
            <PressableScale scale={0.92} onPress={() => router.back()}>
              <View style={[styles.closeBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
                <Icon name="close" size="sm" color={theme.colors.text.primary} />
              </View>
            </PressableScale>
          </View>

          <ChatHeader />

          <View style={styles.messagesArea}>
            <ChatMessageList
              messages={messages}
              isTyping={isTyping}
              ListHeaderComponent={listHeader}
            />
          </View>

          <SuggestedPrompts onSelect={handlePrompt} disabled={isTyping} />
          <SmartActions />
          <ChatInputBar
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            disabled={isTyping}
          />
        </View>
      </KeyboardAvoidingView>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesArea: {
    flex: 1,
    minHeight: 120,
  },
  listHeader: {
    gap: 16,
    marginBottom: 8,
  },
});
