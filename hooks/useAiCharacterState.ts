import { useCallback, useEffect, useRef, useState } from 'react';

export type AiCharacterVisualState = 'idle' | 'speaking';

export interface UseAiCharacterStateReturn {
  characterState: AiCharacterVisualState;
  message: string;
  speak: (nextMessage: string) => void;
  onTypingStart: () => void;
  onTypingEnd: () => void;
}

const IDLE_DELAY_MS = 400;

export function useAiCharacterState(initialMessage = ''): UseAiCharacterStateReturn {
  const [characterState, setCharacterState] = useState<AiCharacterVisualState>('idle');
  const [message, setMessage] = useState(initialMessage);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearIdleTimeout, [clearIdleTimeout]);

  const speak = useCallback(
    (nextMessage: string) => {
      clearIdleTimeout();
      setCharacterState('idle');
      setMessage(nextMessage);
    },
    [clearIdleTimeout]
  );

  const onTypingStart = useCallback(() => {
    clearIdleTimeout();
    setCharacterState('speaking');
  }, [clearIdleTimeout]);

  const onTypingEnd = useCallback(() => {
    clearIdleTimeout();
    idleTimeoutRef.current = setTimeout(() => {
      setCharacterState('idle');
    }, IDLE_DELAY_MS);
  }, [clearIdleTimeout]);

  return {
    characterState,
    message,
    speak,
    onTypingStart,
    onTypingEnd,
  };
}
