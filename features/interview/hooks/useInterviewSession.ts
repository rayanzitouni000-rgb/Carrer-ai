import { useCallback, useEffect, useRef, useState } from 'react';

import { useInterviewHistory } from '@/hooks/useInterviewHistory';
import { useOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import { transcribeInterviewAnswer } from '@/services/interviewTranscriptionApi';
import type {
  InterviewAnswer,
  InterviewSession,
  StartSessionParams,
  TranscriptEntry,
} from '@/types/interviewSimulator';
import { buildMockFeedback } from '@/utils/interviewSimulatorUtils';

const AI_SPEAK_DURATION_MS = 3200;
export const TRANSCRIPTION_ERROR_MESSAGE = "Je n'ai pas bien entendu, réessaie";

function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createTranscriptId(): string {
  return `transcript-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useInterviewSession() {
  const { saveSession } = useInterviewHistory();
  const { markAssessmentDone } = useOnboardingAssessment();
  const { linkSessionToInterview } = useRealInterviews();

  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingTranscription, setIsProcessingTranscription] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSessionRef = useRef<InterviewSession | null>(null);
  const currentQuestionIndexRef = useRef(0);
  const isRecordingRef = useRef(false);

  const [isPaused, setIsPaused] = useState(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  const appendTranscript = useCallback((entry: Omit<TranscriptEntry, 'id' | 'timestamp'>) => {
    const next: TranscriptEntry = {
      id: createTranscriptId(),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setTranscript((prev) => [...prev, next]);
    return next.id;
  }, []);

  const patchTranscript = useCallback((id: string, patch: Partial<TranscriptEntry>) => {
    setTranscript((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }, []);

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
    setIsRecording(false);
    isRecordingRef.current = false;
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
      setTranscript([]);
      setIsRecording(false);
      isRecordingRef.current = false;
      setIsProcessingTranscription(false);
      setIsAiSpeaking(false);
      setIsPaused(false);
      setIsLive(true);
      startTimer();
      return session;
    },
    [startTimer]
  );

  const playQuestion = useCallback(() => {
    const session = activeSessionRef.current;
    const question = session?.questions[currentQuestionIndexRef.current];
    if (!question) return;

    appendTranscript({ role: 'ai', text: question.text });

    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    setIsAiSpeaking(true);
    speakTimeoutRef.current = setTimeout(() => {
      setIsAiSpeaking(false);
      speakTimeoutRef.current = null;
    }, AI_SPEAK_DURATION_MS);
  }, [appendTranscript]);

  const startRecording = useCallback(() => {
    if (isPaused || isAiSpeaking || isProcessingTranscription || isRecordingRef.current) {
      return false;
    }
    isRecordingRef.current = true;
    setIsRecording(true);
    return true;
  }, [isAiSpeaking, isPaused, isProcessingTranscription]);

  const stopRecording = useCallback(async (): Promise<{ success: boolean; text?: string }> => {
    if (!isRecordingRef.current) {
      return { success: false };
    }

    isRecordingRef.current = false;
    setIsRecording(false);
    const pendingId = appendTranscript({ role: 'user', text: '', isPending: true });
    setIsProcessingTranscription(true);

    try {
      const { text } = await transcribeInterviewAnswer();
      const trimmed = text?.trim() ?? '';

      if (!trimmed) {
        patchTranscript(pendingId, {
          text: TRANSCRIPTION_ERROR_MESSAGE,
          isPending: false,
          isError: true,
        });
        return { success: false };
      }

      patchTranscript(pendingId, {
        text: trimmed,
        isPending: false,
        isError: false,
      });

      const question = activeSessionRef.current?.questions[currentQuestionIndexRef.current];
      if (question) {
        setActiveSession((prev) => {
          if (!prev) return prev;
          const answers: InterviewAnswer[] = [
            ...prev.answers.filter((answer) => answer.questionId !== question.id),
            { questionId: question.id, text: trimmed },
          ];
          return { ...prev, answers };
        });
      }

      return { success: true, text: trimmed };
    } catch {
      patchTranscript(pendingId, {
        text: TRANSCRIPTION_ERROR_MESSAGE,
        isPending: false,
        isError: true,
      });
      return { success: false };
    } finally {
      setIsProcessingTranscription(false);
    }
  }, [appendTranscript, patchTranscript]);

  const submitAnswer = useCallback((text: string) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const question = prev.questions[currentQuestionIndexRef.current];
      if (!question) return prev;
      const answers: InterviewAnswer[] = [
        ...prev.answers.filter((answer) => answer.questionId !== question.id),
        { questionId: question.id, text: text.trim() },
      ];
      return { ...prev, answers };
    });
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((index) => index + 1);
  }, []);

  const endSession = useCallback(
    async (options?: { realInterviewId?: string }) => {
      stopTimer();
      setIsLive(false);
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsAiSpeaking(false);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);

      if (!activeSessionRef.current) return null;

      const feedback = buildMockFeedback(activeSessionRef.current.answers.length);
      const completed: InterviewSession = {
        ...activeSessionRef.current,
        realInterviewId: options?.realInterviewId ?? activeSessionRef.current.realInterviewId,
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
    [linkSessionToInterview, markAssessmentDone, saveSession, stopTimer]
  );

  const resetSession = useCallback(() => {
    stopTimer();
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    setActiveSession(null);
    setCurrentQuestionIndex(0);
    setIsLive(false);
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    setIsPaused(false);
    setTranscript([]);
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsProcessingTranscription(false);
    setIsAiSpeaking(false);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    };
  }, [stopTimer]);

  const formattedTimer = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(
    elapsedSeconds % 60
  ).padStart(2, '0')}`;

  const currentQuestion = activeSession?.questions[currentQuestionIndex] ?? null;
  const isLastQuestion =
    activeSession !== null && currentQuestionIndex >= activeSession.questions.length - 1;

  const canRecord =
    isLive &&
    !isPaused &&
    !isAiSpeaking &&
    !isProcessingTranscription &&
    !isRecording;

  return {
    activeSession,
    currentQuestion,
    currentQuestionIndex,
    isLastQuestion,
    isLive,
    isPaused,
    isRecording,
    isProcessingTranscription,
    isAiSpeaking,
    canRecord,
    transcript,
    timer: formattedTimer,
    elapsedSeconds,
    startSession,
    playQuestion,
    startRecording,
    stopRecording,
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
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [active]);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const reset = useCallback(() => setSeconds(0), []);

  return { seconds, formatted, reset };
}
