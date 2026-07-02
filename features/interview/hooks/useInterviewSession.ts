import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import { incrementInterviewSessionCount } from '@/hooks/useInterviewHistory';

export function useInterviewTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [active]);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const reset = useCallback(() => setSeconds(0), []);

  return { seconds, formatted, reset };
}

export function useInterviewSession() {
  const [isLive, setIsLive] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { seconds, formatted, reset } = useInterviewTimer(isLive);
  const hadLiveSessionRef = useRef(false);

  const startInterview = useCallback(() => {
    reset();
    setIsLive(true);
    hadLiveSessionRef.current = true;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 600, animated: true });
    }, 300);
  }, [reset]);

  const endInterview = useCallback(() => {
    if (isLive && hadLiveSessionRef.current && seconds >= 10) {
      void incrementInterviewSessionCount();
    }
    hadLiveSessionRef.current = false;
    setIsLive(false);
  }, [isLive, seconds]);

  return {
    isLive,
    startInterview,
    endInterview,
    timer: formatted,
    scrollRef,
  };
}

export type UseInterviewSessionReturn = ReturnType<typeof useInterviewSession>;
