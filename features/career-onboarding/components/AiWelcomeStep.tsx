import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AiCharacterAvatar, AiSpeechBubble } from '@/components/aiCharacter';
import { useFadeIn, duration, useTheme } from '@/design-system';
import { useAiCharacterState } from '@/hooks/useAiCharacterState';

import { WELCOME_AI_MESSAGE } from '../constants/aiCharacterMessages';

const LOADING_DURATION_MS = 1800;
const BUBBLE_DELAY_MS = 500;

interface AiWelcomeStepProps {
  message?: string;
  onIntroComplete?: (complete: boolean) => void;
}

export function AiWelcomeStep({
  message = WELCOME_AI_MESSAGE,
  onIntroComplete,
}: AiWelcomeStepProps) {
  const theme = useTheme();
  const [phase, setPhase] = useState<'loading' | 'intro'>('loading');
  const [showBubble, setShowBubble] = useState(false);
  const { animatedStyle, start } = useFadeIn(0, duration.slower);
  const { characterState, message: spokenMessage, speak, onTypingStart, onTypingEnd } =
    useAiCharacterState('');

  useEffect(() => {
    onIntroComplete?.(false);
    const loadingTimer = setTimeout(() => {
      setPhase('intro');
      start();
    }, LOADING_DURATION_MS);

    return () => clearTimeout(loadingTimer);
  }, [onIntroComplete, start]);

  useEffect(() => {
    if (phase !== 'intro') return;

    const bubbleTimer = setTimeout(() => {
      speak(message);
      setShowBubble(true);
    }, BUBBLE_DELAY_MS);

    return () => clearTimeout(bubbleTimer);
  }, [message, phase, speak]);

  const handleTypingEnd = () => {
    onTypingEnd();
    onIntroComplete?.(true);
  };

  if (phase === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.brand.primaryLight} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <AiCharacterAvatar state={characterState} size="large" />
        {showBubble && (
          <AiSpeechBubble
            message={spokenMessage}
            onTypingStart={onTypingStart}
            onTypingEnd={handleTypingEnd}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: -4,
  },
  content: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
});
