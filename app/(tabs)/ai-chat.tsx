import { useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/design-system';

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

const TAB_BAR_OFFSET = Platform.OS === 'ios' ? 88 : 68;

export default function AiChatScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? TAB_BAR_OFFSET : 0}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top + 8,
              paddingHorizontal: theme.spacing['4'],
            },
          ]}
        >
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

          <View style={{ height: TAB_BAR_OFFSET - 20 }} />
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
  messagesArea: {
    flex: 1,
    minHeight: 120,
  },
  listHeader: {
    gap: 16,
    marginBottom: 8,
  },
});
