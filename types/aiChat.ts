export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  messages: ChatMessage[];
}

export const WELCOME_MESSAGE_CONTENT = 'Salut ! Comment puis-je t\'aider aujourd\'hui ?';
