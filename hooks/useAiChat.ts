import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { getMockAiResponse } from '@/data/mockAiChatResponses';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { careerProfileStore } from '@/services/careerProfileStore';
import type { ChatMessage } from '@/types/aiChat';
import { WELCOME_MESSAGE_CONTENT } from '@/types/aiChat';

const WELCOME_MESSAGE_ID = 'welcome-assistant';

function createWelcomeMessage(): ChatMessage {
  return {
    id: WELCOME_MESSAGE_ID,
    role: 'assistant',
    content: WELCOME_MESSAGE_CONTENT,
    timestamp: new Date().toISOString(),
  };
}

function parseMessages(raw: string | null): ChatMessage[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { messages?: unknown };
    if (!Array.isArray(parsed.messages)) return null;
    const messages = parsed.messages.filter(
      (item): item is ChatMessage =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as ChatMessage).id === 'string' &&
        ((item as ChatMessage).role === 'user' || (item as ChatMessage).role === 'assistant') &&
        typeof (item as ChatMessage).content === 'string' &&
        typeof (item as ChatMessage).timestamp === 'string'
    );
    return messages;
  } catch {
    return null;
  }
}

async function readSession(): Promise<ChatMessage[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.aiChatHistory);
  const stored = parseMessages(raw);
  if (stored && stored.length > 0) return stored;
  return [createWelcomeMessage()];
}

async function writeSession(messages: ChatMessage[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.aiChatHistory, JSON.stringify({ messages }));
}

function randomTypingDelayMs(): number {
  return 600 + Math.floor(Math.random() * 601);
}

export interface UseAiChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  isReady: boolean;
  canSendMessage: boolean;
  sendMessage: (text: string) => void;
  clearChat: () => Promise<void>;
}

export function useAiChat(): UseAiChatReturn {
  const { canSendChatMessage, incrementChatMessages } = useUsageLimits();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    void readSession().then(async (session) => {
      if (!mounted) return;
      setMessages(session);
      if (session.length === 1 && session[0]?.id === WELCOME_MESSAGE_ID) {
        await writeSession(session);
      }
      setIsReady(true);
    });
    return () => {
      mounted = false;
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const persistMessages = useCallback(async (next: ChatMessage[]) => {
    setMessages(next);
    await writeSession(next);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !canSendChatMessage) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      const withUser = [...messages, userMessage];
      void persistMessages(withUser);
      setIsTyping(true);

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      typingTimerRef.current = setTimeout(() => {
        const profile = careerProfileStore.get();
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: getMockAiResponse(trimmed, profile),
          timestamp: new Date().toISOString(),
        };

        void persistMessages([...withUser, assistantMessage]);
        setIsTyping(false);
        void incrementChatMessages();
      }, randomTypingDelayMs());
    },
    [canSendChatMessage, incrementChatMessages, isTyping, messages, persistMessages]
  );

  const clearChat = useCallback(async () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTyping(false);
    const welcome = [createWelcomeMessage()];
    await writeSession(welcome);
    setMessages(welcome);
  }, []);

  return {
    messages,
    isTyping,
    isReady,
    canSendMessage: canSendChatMessage,
    sendMessage,
    clearChat,
  };
}
