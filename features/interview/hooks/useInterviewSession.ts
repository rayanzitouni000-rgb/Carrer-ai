import { useCallback, useRef, useState, useEffect } from 'react';

import { useInterviewHistory } from '@/hooks/useInterviewHistory';
import { useOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import type {
  InterviewAnswer,
  InterviewSession,
  StartSessionParams,
} from '@/types/interviewSimulator';
import { buildMockFeedback } from '@/utils/interviewSimulatorUtils';

function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useInterviewSession() {
  const { saveSession } = useInterviewHistory();
  const { markAssessmentDone } = useOnboardingAssessment();
  const { linkSessionToInterview } = useRealInterviews();

  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const elapsedRef = useRef(0);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    sessionStartRef.current = Date.now() - elapsedRef.current * 1000;
    timerRef.current = setInterval(() => {
      if (sessionStartRef.current) {
        const next = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        elapsedRef.current = next;
        setElapsedSeconds(next);
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const pauseSession = useCallback(() => {
    stopTimer();
    setIsPaused(true);
  }, [stopTimer]);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  const startSession = useCallback(
    (params: StartSessionParams & { questions: InterviewSession['questions'] }) => {
      const session: InterviewSession = {
        id: createSessionId(),
        date: new Date().toISOString(),
        targetRole: params.targetRole,
        type: params.type,
        difficulty: params.difficulty,
        questions: params.questions,
        answers: [],
        feedback: null,
        sessionSource: params.sessionSource,
        jobOfferId: params.jobOfferId,
        realInterviewId: params.realInterviewId,
      };
      setActiveSession(session);
      setCurrentQuestionIndex(0);
      setElapsedSeconds(0);
      elapsedRef.current = 0;
      setIsPaused(false);
      setIsLive(true);
      startTimer();
      return session;
    },
    [startTimer]
  );

  const submitAnswer = useCallback((text: string) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const question = prev.questions[currentQuestionIndex];
      if (!question) return prev;
      const answers: InterviewAnswer[] = [
        ...prev.answers.filter((a) => a.questionId !== question.id),
        { questionId: question.id, text: text.trim() },
      ];
      return { ...prev, answers };
    });
  }, [currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((index) => index + 1);
  }, []);

  const endSession = useCallback(
    async (options?: { realInterviewId?: string }) => {
      stopTimer();
      setIsLive(false);

      if (!activeSession) return null;

      const feedback = buildMockFeedback(activeSession.answers.length);
      const completed: InterviewSession = {
        ...activeSession,
        realInterviewId: options?.realInterviewId ?? activeSession.realInterviewId,
        feedback,
      };

      await saveSession(completed);

      if (completed.sessionSource === 'assessment') {
        await markAssessmentDone(feedback.overallScore);
      }

      const interviewId = completed.realInterviewId;
      if (interviewId) {
        await linkSessionToInterview(interviewId, completed.id);
      }

      setActiveSession(completed);
      return completed;
    },
    [activeSession, linkSessionToInterview, markAssessmentDone, saveSession, stopTimer]
  );

  const resetSession = useCallback(() => {
    stopTimer();
    setActiveSession(null);
    setCurrentQuestionIndex(0);
    setIsLive(false);
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    setIsPaused(false);
  }, [stopTimer]);

  const formattedTimer = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(
    elapsedSeconds % 60
  ).padStart(2, '0')}`;

  const currentQuestion = activeSession?.questions[currentQuestionIndex] ?? null;
  const isLastQuestion =
    activeSession !== null && currentQuestionIndex >= activeSession.questions.length - 1;

  return {
    activeSession,
    currentQuestion,
    currentQuestionIndex,
    isLastQuestion,
    isLive,
    isPaused,
    timer: formattedTimer,
    elapsedSeconds,
    startSession,
    submitAnswer,
    goToNextQuestion,
    endSession,
    resetSession,
    pauseSession,
    resumeSession,
  };
}

export type UseInterviewSessionReturn = ReturnType<typeof useInterviewSession>;

/** Legacy timer helper — conservé pour compatibilité des anciens composants mock. */
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
