import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiveInterviewSessionView } from '@/components/interview/LiveInterviewSessionView';
import { getMockJobById } from '@/data/mockJobOffers';
import { useInterviewSession } from '@/features/interview/hooks';
import { careerProfileStore } from '@/services/careerProfileStore';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import type { InterviewDifficulty, InterviewSessionType, SessionSource } from '@/types/interviewSimulator';
import { getQuestionsForSession, suggestDifficultyFromSkills } from '@/utils/interviewSimulatorUtils';

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

  const profile = useMemo(() => careerProfileStore.get(), []);
  const { interviews } = useRealInterviews();
  const sessionApi = useInterviewSession();
  const startedRef = useRef(false);
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isAssessment = parseBool(params.isAssessment);
  const realInterview = params.interviewId
    ? interviews.find((item) => item.id === params.interviewId)
    : undefined;
  const jobOffer = params.jobOfferId ? getMockJobById(params.jobOfferId) : undefined;

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
    jobOffer?.title ??
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

    const questions = getQuestionsForSession(type, difficulty);
    // TODO: remplacer par génération IA basée sur jobOffer.description quand le backend sera prêt
    sessionApi.startSession({
      targetRole,
      type,
      difficulty,
      sessionSource,
      jobOfferId: params.jobOfferId,
      realInterviewId: params.interviewId,
      questions,
    });
    triggerAiSpeaking();
  }, [
    sessionApi,
    type,
    difficulty,
    targetRole,
    sessionSource,
    params.jobOfferId,
    params.interviewId,
    triggerAiSpeaking,
  ]);

  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    };
  }, []);

  const finishAndNavigate = useCallback(
    async (completed: NonNullable<Awaited<ReturnType<typeof sessionApi.endSession>>>) => {
      router.replace({
        pathname: './feedback',
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
    if (sessionApi.isPaused || aiSpeaking || isMuted) return;
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
});
