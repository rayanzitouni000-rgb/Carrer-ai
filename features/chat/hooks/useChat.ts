import { useCallback, useState } from 'react';

import { ChatMessage, getMockAiResponse } from '../constants/mockData';

function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function useChat(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(initialMessages.length > 0);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setHasStarted(true);
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: getMockAiResponse(trimmed),
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1800);
  }, [isTyping]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setHasStarted(false);
    setIsTyping(false);
  }, []);

  return {
    messages,
    input,
    setInput,
    isTyping,
    hasStarted,
    sendMessage,
    clearChat,
    isEmpty: messages.length === 0,
  };
}

export type UseChatReturn = ReturnType<typeof useChat>;
