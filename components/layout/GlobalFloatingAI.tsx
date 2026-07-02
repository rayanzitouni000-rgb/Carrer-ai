import { useSegments } from 'expo-router';

import { HomeFloatingAI } from '@/features/home/components';

const HIDDEN_ROOTS = new Set([
  'splash',
  'onboarding',
  'career-onboarding',
  'signup',
  'login',
  'goal-selection',
  'ai-chat',
]);

export function GlobalFloatingAI() {
  const segments = useSegments();
  const root = segments[0];

  if (!root || HIDDEN_ROOTS.has(root)) {
    return null;
  }

  return <HomeFloatingAI />;
}
