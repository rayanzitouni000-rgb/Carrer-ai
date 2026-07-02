import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { InterviewAudioVisualizer } from '@/components/interview/InterviewAudioVisualizer';
import { InterviewCallControls } from '@/components/interview/InterviewCallControls';
import { Text, useTheme } from '@/design-system';

interface LiveInterviewSessionViewProps {
  timer: string;
  questionText?: string;
  aiSpeaking: boolean;
  isUserSpeaking: boolean;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onHangUp: () => void;
  onTogglePause: () => void;
  onStartSpeaking: () => void;
  onStopSpeaking: () => void;
}

export function LiveInterviewSessionView({
  timer,
  questionText,
  aiSpeaking,
  isUserSpeaking,
  isMuted,
  isPaused,
  onToggleMute,
  onHangUp,
  onTogglePause,
  onStartSpeaking,
  onStopSpeaking,
}: LiveInterviewSessionViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(6, 182, 212, 0.08)', 'rgba(59, 130, 246, 0.05)', 'transparent']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.header}>
        <Text variant="label" color={theme.colors.text.secondary}>
          Entretien en cours
        </Text>
        <Text variant="hero" color={theme.colors.text.primary}>
          {timer}
        </Text>
        {isPaused && (
          <Text variant="caption" color={theme.colors.status.warning}>
            En pause
          </Text>
        )}
      </View>

      <View style={styles.center}>
        <AiCharacterAvatar state={aiSpeaking ? 'speaking' : 'idle'} size="large" />

        {questionText ? (
          <Text variant="body" color={theme.colors.text.secondary} align="center" style={styles.caption}>
            "{questionText}"
          </Text>
        ) : null}
      </View>

      <Pressable
        onPressIn={onStartSpeaking}
        onPressOut={onStopSpeaking}
        disabled={isPaused || aiSpeaking || isMuted}
        style={styles.visualizerArea}
      >
        <InterviewAudioVisualizer active={isUserSpeaking} muted={isMuted} />
      </Pressable>

      <InterviewCallControls
        isMuted={isMuted}
        isPaused={isPaused}
        onToggleMute={onToggleMute}
        onHangUp={onHangUp}
        onTogglePause={onTogglePause}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 16,
  },
  caption: {
    maxWidth: 320,
    lineHeight: 24,
    opacity: 0.88,
  },
  visualizerArea: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
