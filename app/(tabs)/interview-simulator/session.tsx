import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiveInterviewSessionView } from '@/components/interview/LiveInterviewSessionView';
import { Text } from '@/design-system';
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

const AI_SPEAK_DURATION_MS = 3200;

export default function InterviewSessionScreen() {
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
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
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

  const triggerAiSpeaking = useCallback(() => {
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    setAiSpeaking(true);
    speakTimeoutRef.current = setTimeout(() => {
      setAiSpeaking(false);
    }, AI_SPEAK_DURATION_MS);
  }, []);

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
      triggerAiSpeaking();
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
    triggerAiSpeaking,
    profile,
  ]);

  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    };
  }, []);

  const finishAndNavigate = useCallback(
    async (completed: NonNullable<Awaited<ReturnType<typeof sessionApi.endSession>>>) => {
      router.replace({
        pathname: '/(tabs)/interview-simulator/feedback',
        params: { sessionId: completed.id },
      });
    },
    [router, sessionApi]
  );

  const handleHangUp = useCallback(async () => {
    const completed = await sessionApi.endSession({ realInterviewId: params.interviewId });
    if (completed) {
      await finishAndNavigate(completed);
    } else {
      router.back();
    }
  }, [sessionApi, params.interviewId, finishAndNavigate, router]);

  const advanceAfterAnswer = useCallback(async () => {
    sessionApi.submitAnswer('Réponse orale simulée');

    if (sessionApi.isLastQuestion) {
      const completed = await sessionApi.endSession({ realInterviewId: params.interviewId });
      if (completed) {
        await finishAndNavigate(completed);
      }
      return;
    }

    sessionApi.goToNextQuestion();
    triggerAiSpeaking();
  }, [sessionApi, params.interviewId, finishAndNavigate, triggerAiSpeaking]);

  const handleStartSpeaking = () => {
    if (sessionApi.isPaused || aiSpeaking || isMuted || isLoadingQuestions) return;
    setIsUserSpeaking(true);
  };

  const handleStopSpeaking = () => {
    if (!isUserSpeaking) return;
    setIsUserSpeaking(false);
    void advanceAfterAnswer();
  };

  const handleTogglePause = () => {
    if (sessionApi.isPaused) {
      sessionApi.resumeSession();
      return;
    }
    sessionApi.pauseSession();
    setIsUserSpeaking(false);
  };

  if (isLoadingQuestions) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top + 12 }]}>
        <ActivityIndicator size="large" color="#60A5FA" />
        <Text variant="body" color="#94A3B8" style={styles.loadingText}>
          Préparation des questions d'entretien…
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      {loadError ? (
        <Text variant="caption" color="#94A3B8" style={styles.fallbackHint}>
          {loadError}
        </Text>
      ) : null}
      <LiveInterviewSessionView
        timer={sessionApi.timer}
        questionText={sessionApi.currentQuestion?.text}
        aiSpeaking={aiSpeaking}
        isUserSpeaking={isUserSpeaking}
        isMuted={isMuted}
        isPaused={sessionApi.isPaused}
        onToggleMute={() => setIsMuted((value) => !value)}
        onHangUp={() => void handleHangUp()}
        onTogglePause={handleTogglePause}
        onStartSpeaking={handleStartSpeaking}
        onStopSpeaking={handleStopSpeaking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 8,
  },
  fallbackHint: {
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
});
