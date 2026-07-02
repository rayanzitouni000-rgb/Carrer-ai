import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AiCharacterAvatar } from './AiCharacterAvatar';
import { AiSpeechBubble } from './AiSpeechBubble';
import { useAiCharacterState } from '@/hooks/useAiCharacterState';

interface AiStepHeaderProps {
  message: string;
}

export function AiStepHeader({ message }: AiStepHeaderProps) {
  const { characterState, message: spokenMessage, speak, onTypingStart, onTypingEnd } =
    useAiCharacterState(message);

  useEffect(() => {
    speak(message);
  }, [message, speak]);

  return (
    <View style={styles.container}>
      <AiCharacterAvatar state={characterState} size="medium" />
      <AiSpeechBubble
        message={spokenMessage}
        onTypingStart={onTypingStart}
        onTypingEnd={onTypingEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    alignItems: 'center',
  },
});
