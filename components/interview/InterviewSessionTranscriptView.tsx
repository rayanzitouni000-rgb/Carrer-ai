import { useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { TranscriptBubble } from '@/components/interview/TranscriptBubble';
import { Icon, PressableScale, Text, useTheme } from '@/design-system';
import type { TranscriptEntry } from '@/types/interviewSimulator';

interface InterviewSessionTranscriptViewProps {
  timer: string;
  transcript: TranscriptEntry[];
  characterState: 'idle' | 'speaking';
  isRecording: boolean;
  isProcessingTranscription: boolean;
  canRecord: boolean;
  isPaused: boolean;
  onQuit: () => void;
  onHangUp: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

function RecordingMicButton({
  active,
  disabled,
  onPressIn,
  onPressOut,
}: {
  active: boolean;
  disabled: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}) {
  const theme = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      pulse.value = withTiming(1, { duration: 180 });
      return;
    }
    pulse.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 450 }), withTiming(1, { duration: 450 })),
      -1,
      true
    );
  }, [active, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={pulseStyle}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={[
          styles.micButton,
          {
            backgroundColor: active
              ? theme.colors.brand.primary
              : theme.colors.card.elevated,
            borderColor: active ? theme.colors.brand.primaryLight : theme.colors.border.subtle,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Maintenir pour répondre"
      >
        <Icon
          name="mic-outline"
          size="lg"
          color={active ? '#FFFFFF' : theme.colors.text.primary}
        />
      </Pressable>
    </Animated.View>
  );
}

export function InterviewSessionTranscriptView({
  timer,
  transcript,
  characterState,
  isRecording,
  isProcessingTranscription,
  canRecord,
  isPaused,
  onQuit,
  onHangUp,
  onStartRecording,
  onStopRecording,
}: InterviewSessionTranscriptViewProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 60);
    return () => clearTimeout(timeout);
  }, [transcript.length, isRecording, isProcessingTranscription]);

  const handleQuit = () => {
    Alert.alert(
      'Quitter la session ?',
      'Ta progression sur cet entretien sera perdue.',
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: onQuit },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border.subtle }]}>
        <PressableScale scale={0.94} onPress={handleQuit}>
          <View style={styles.quitBtn}>
            <Icon name="chevron-back" size="sm" color={theme.colors.text.secondary} />
            <Text variant="label" color={theme.colors.text.secondary}>
              Quitter
            </Text>
          </View>
        </PressableScale>

        <Text variant="label" color={theme.colors.text.primary} style={styles.timer}>
          {timer}
        </Text>

        <View style={styles.headerAvatar}>
          <AiCharacterAvatar state={characterState} size="small" />
        </View>
      </View>

      {isPaused ? (
        <View style={[styles.pauseBanner, { backgroundColor: theme.colors.card.default }]}>
          <Text variant="caption" color={theme.colors.status.warning}>
            Session en pause
          </Text>
        </View>
      ) : null}

      <ScrollView
        ref={scrollRef}
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {transcript.length === 0 ? (
          <Text variant="body" color={theme.colors.text.muted} align="center" style={styles.emptyHint}>
            L&apos;entretien va commencer…
          </Text>
        ) : (
          transcript.map((entry, index) => (
            <TranscriptBubble key={entry.id} entry={entry} index={index} />
          ))
        )}
      </ScrollView>

      <View style={[styles.controls, { borderTopColor: theme.colors.border.subtle }]}>
        {isRecording ? (
          <Text variant="caption" color={theme.colors.brand.primaryLight} style={styles.recordingHint}>
            Enregistrement…
          </Text>
        ) : isProcessingTranscription ? (
          <Text variant="caption" color={theme.colors.text.muted} style={styles.recordingHint}>
            Transcription en cours…
          </Text>
        ) : (
          <Text variant="caption" color={theme.colors.text.muted} style={styles.recordingHint}>
            Maintenir pour répondre
          </Text>
        )}

        <View style={styles.controlsRow}>
          <RecordingMicButton
            active={isRecording}
            disabled={!canRecord && !isRecording}
            onPressIn={onStartRecording}
            onPressOut={onStopRecording}
          />

          <PressableScale scale={0.92} onPress={onHangUp}>
            <View style={[styles.hangUpBtn, { backgroundColor: theme.colors.status.danger }]}>
              <Icon name="call" size="md" color="#FFFFFF" />
            </View>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  quitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 72,
  },
  timer: {
    fontVariant: ['tabular-nums'],
  },
  headerAvatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  transcriptScroll: {
    flex: 1,
  },
  transcriptContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyHint: {
    marginTop: 48,
  },
  controls: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  recordingHint: {
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  hangUpBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
