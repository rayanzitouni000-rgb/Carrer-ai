import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

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
  const { formatted, reset } = useInterviewTimer(isLive);

  const startInterview = useCallback(() => {
    reset();
    setIsLive(true);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 600, animated: true });
    }, 300);
  }, [reset]);

  const endInterview = useCallback(() => {
    setIsLive(false);
  }, []);

  return {
    isLive,
    startInterview,
    endInterview,
    timer: formatted,
    scrollRef,
  };
}

export type UseInterviewSessionReturn = ReturnType<typeof useInterviewSession>;
