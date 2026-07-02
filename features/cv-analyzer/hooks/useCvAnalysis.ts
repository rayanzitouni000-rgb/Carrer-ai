import { useCallback, useEffect, useState } from 'react';

import { ANALYSIS_STEPS } from '../constants/mockData';
import { incrementCvAnalyzedCount } from '@/hooks/useCvActionsTracking';

export type AnalysisPhase = 'idle' | 'analyzing' | 'complete';

const ANALYSIS_DURATION = 6000;

export function useCvAnalysis() {
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const startAnalysis = useCallback(() => {
    setFileName('Rayan_Zitouni_CV.pdf');
    setPhase('analyzing');
    setProgress(0);
    setStepIndex(0);
  }, []);

  useEffect(() => {
    if (phase !== 'analyzing') return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, ANALYSIS_DURATION / 50);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 1000);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setPhase('complete');
      void incrementCvAnalyzedCount();
    }, ANALYSIS_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(completeTimer);
    };
  }, [phase]);

  const reset = useCallback(() => {
    setPhase('idle');
    setProgress(0);
    setStepIndex(0);
    setFileName(null);
  }, []);

  return {
    phase,
    progress,
    stepIndex,
    currentStep: ANALYSIS_STEPS[stepIndex],
    fileName,
    startAnalysis,
    reset,
    isIdle: phase === 'idle',
    isAnalyzing: phase === 'analyzing',
    isComplete: phase === 'complete',
  };
}

export type UseCvAnalysisReturn = ReturnType<typeof useCvAnalysis>;
