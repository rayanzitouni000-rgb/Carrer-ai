import { useRef, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ChatMessage } from '../constants/mockData';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  ListHeaderComponent?: React.ReactElement | null;
}

export function ChatMessageList({ messages, isTyping, ListHeaderComponent }: ChatMessageListProps) {
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isTyping]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <MessageBubble message={item} index={index} />}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={<TypingIndicator visible={isTyping} />}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 8,
    flexGrow: 1,
  },
});
