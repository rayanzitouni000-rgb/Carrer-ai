import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { InterviewSessionTranscriptView } from '@/components/interview/InterviewSessionTranscriptView';
import { Text, useTheme } from '@/design-system';
import { useInterviewSession } from '@/features/interview/hooks';
import { careerProfileStore } from '@/services/careerProfileStore';
import {
  fetchInterviewQuestionsFromApi,
  getFallbackInterviewQuestions,
  resolveJobOfferForInterview,
} from '@/services/interviewQuestionsApi';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import type { InterviewDifficulty, InterviewSessionType, SessionSource } from '@/types/interviewSimulator';
import { suggestDifficultyFromSkills } from '@/utils/interviewSimulatorUtils';

function parseBool(value?: string): boolean {
  return value === 'true' || value === '1';
}

export default function InterviewSessionScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    interviewId?: string;
    jobOfferId?: string;
    isAssessment?: string;
    targetRole?: string;
    type?: string;
    difficulty?: string;
  }>();

  const [profile, setProfile] = useState(() => careerProfileStore.get());
  const { interviews } = useRealInterviews();
  const { incrementInterviewSessions } = useUsageLimits();
  const sessionApi = useInterviewSession();
  const startedRef = useRef(false);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void careerProfileStore.hydrate().then(setProfile);
  }, []);

  const isAssessment = parseBool(params.isAssessment);
  const realInterview = params.interviewId
    ? interviews.find((item) => item.id === params.interviewId)
    : undefined;

  const sessionSource: SessionSource = isAssessment
    ? 'assessment'
    : params.jobOfferId
      ? 'job_match'
      : params.interviewId
        ? 'real_interview'
        : 'free';

  const targetRole =
    params.targetRole ??
    realInterview?.jobTitle ??
    profile.targetRoles[0] ??
    'Poste visé';

  const type = (isAssessment ? 'mixed' : (params.type as InterviewSessionType)) ?? 'behavioral';
  const difficulty = (
    isAssessment
      ? suggestDifficultyFromSkills(profile)
      : ((params.difficulty as InterviewDifficulty) ?? suggestDifficultyFromSkills(profile))
  ) as InterviewDifficulty;

  useEffect(() => {
    if (startedRef.current || sessionApi.isLive) return;
    startedRef.current = true;

    void (async () => {
      setIsLoadingQuestions(true);
      setLoadError(null);

      let questions = getFallbackInterviewQuestions(type, difficulty);

      try {
        const jobOffer = await resolveJobOfferForInterview(params.jobOfferId);
        questions = await fetchInterviewQuestionsFromApi({
          profile,
          jobOffer,
          difficulty,
          sessionType: type,
        });
      } catch {
        questions = getFallbackInterviewQuestions(type, difficulty);
        setLoadError('Questions par défaut utilisées (connexion ou quota IA).');
      }

      sessionApi.startSession({
        targetRole,
        type,
        difficulty,
        sessionSource,
        jobOfferId: params.jobOfferId,
        realInterviewId: params.interviewId,
        questions,
      });

      if (!isAssessment) {
        void incrementInterviewSessions();
      }

      setIsLoadingQuestions(false);
      sessionApi.playQuestion();
    })();
  }, [
    sessionApi,
    type,
    difficulty,
    targetRole,
    sessionSource,
    params.jobOfferId,
    params.interviewId,
    isAssessment,
    incrementInterviewSessions,
    profile,
  ]);

  const finishAndNavigate = useCallback(
    async (completed: NonNullable<Awaited<ReturnType<typeof sessionApi.endSession>>>) => {
      router.replace({
        pathname: '/(tabs)/interview-simulator/feedback',
        params: { sessionId: completed.id },
      });
    },
    [router]
  );

  const runEndSession = useCallback(async () => {
    setIsAnalyzing(true);
    const completed = await sessionApi.endSession({ realInterviewId: params.interviewId });
    if (completed) {
      await finishAndNavigate(completed);
    } else {
      setIsAnalyzing(false);
      router.back();
    }
  }, [sessionApi, params.interviewId, finishAndNavigate, router]);

  const handleHangUp = useCallback(() => {
    void runEndSession();
  }, [runEndSession]);

  const handleQuit = useCallback(() => {
    sessionApi.resetSession();
    router.back();
  }, [sessionApi, router]);

  const advanceAfterAnswer = useCallback(async () => {
    if (sessionApi.isLastQuestion) {
      await runEndSession();
      return;
    }

    sessionApi.goToNextQuestion();
    sessionApi.playQuestion();
  }, [sessionApi, runEndSession]);

  const handleStartRecording = () => {
    sessionApi.startRecording();
  };

  const handleStopRecording = () => {
    void (async () => {
      const result = await sessionApi.stopRecording();
      if (result.success) {
        await advanceAfterAnswer();
      }
    })();
  };

  const characterState = sessionApi.isAiSpeaking ? 'speaking' : 'idle';

  if (isLoadingQuestions) {
    return (
      <View
        style={[
          styles.root,
          styles.center,
          { paddingTop: insets.top + 12, backgroundColor: theme.colors.background.primary },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.brand.primaryLight} />
        <Text variant="body" color={theme.colors.text.secondary} style={styles.loadingText}>
          Préparation des questions d&apos;entretien…
        </Text>
      </View>
    );
  }

  if (isAnalyzing) {
    return (
      <View
        style={[
          styles.root,
          styles.center,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 16,
            backgroundColor: theme.colors.background.primary,
          },
        ]}
      >
        <AiCharacterAvatar state="idle" size="medium" />
        <Text variant="title" color={theme.colors.text.primary} align="center">
          Analyse de ton entretien en cours…
        </Text>
        <Text variant="body" color={theme.colors.text.secondary} align="center" style={styles.analyzingHint}>
          Notre coach IA prépare ton feedback personnalisé.
        </Text>
        <ActivityIndicator size="small" color={theme.colors.brand.primaryLight} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.colors.background.primary,
        },
      ]}
    >
      {loadError ? (
        <Text variant="caption" color={theme.colors.text.muted} style={styles.fallbackHint}>
          {loadError}
        </Text>
      ) : null}

      <InterviewSessionTranscriptView
        timer={sessionApi.timer}
        transcript={sessionApi.transcript}
        characterState={characterState}
        isRecording={sessionApi.isRecording}
        isProcessingTranscription={sessionApi.isProcessingTranscription}
        canRecord={sessionApi.canRecord}
        isPaused={sessionApi.isPaused}
        onQuit={handleQuit}
        onHangUp={handleHangUp}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 8,
  },
  analyzingHint: {
    maxWidth: 280,
    lineHeight: 22,
  },
  fallbackHint: {
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
});
