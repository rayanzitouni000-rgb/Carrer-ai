import { useCallback, useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import { getApiBaseUrl, isAiApiConfigured, QUOTA_EXCEEDED_MESSAGE } from '@/constants/apiConfig';
import { ANALYSIS_STEPS } from '../constants/mockData';
import type { CvAnalysisApiResult, CvAnalysisResult } from '../types/cvAnalysisResult';
import { cvAnalysisContextStore } from '@/services/cvAnalysisContextStore';
import { incrementCvAnalyzedCount } from '@/hooks/useCvActionsTracking';

export type AnalysisPhase = 'idle' | 'analyzing' | 'complete' | 'error';

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

function resolveMimeType(fileName: string, pickerMime?: string | null): string | null {
  if (pickerMime?.trim()) return pickerMime;
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension] ?? null;
}

export function useCvAnalysis() {
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<CvAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== 'analyzing') return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : prev + 2));
    }, 400);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [phase]);

  const startAnalysis = useCallback(async () => {
    setErrorMessage(null);
    setResult(null);

    const picked = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (picked.canceled || !picked.assets?.[0]) return;

    const asset = picked.assets[0];
    const selectedName = asset.name ?? 'cv.pdf';
    const mimeType = resolveMimeType(selectedName, asset.mimeType);

    if (!mimeType) {
      setPhase('error');
      setErrorMessage('Format non supporté. Utilise un PDF ou une image (JPEG, PNG, WebP).');
      return;
    }

    setFileName(selectedName);
    setPhase('analyzing');
    setProgress(8);
    setStepIndex(0);

    try {
      const baseUrl = getApiBaseUrl();
      if (!baseUrl || !isAiApiConfigured()) {
        throw new Error('API non configurée');
      }

      const fileBase64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(`${baseUrl}/api/analyze-cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, mimeType }),
      });

      const responseText = await response.text();
      let data: {
        analysis?: CvAnalysisApiResult;
        analyzedAt?: string;
        error?: string;
        message?: string;
      };
      try {
        data = JSON.parse(responseText) as typeof data;
      } catch {
        data = { error: responseText };
      }

      if (response.status === 429 && data.error === 'QUOTA_EXCEEDED') {
        setPhase('error');
        setErrorMessage(QUOTA_EXCEEDED_MESSAGE);
        return;
      }

      if (response.status === 422 && data.error === 'PDF_TEXT_EXTRACTION_FAILED') {
        setPhase('error');
        setErrorMessage(
          data.message ??
            'Impossible de lire ce PDF. Essaie avec un autre fichier ou une photo de ton CV.'
        );
        return;
      }

      if (!response.ok || !data.analysis) {
        setPhase('error');
        setErrorMessage(data.error ?? "Erreur lors de l'analyse du CV. Réessaie.");
        return;
      }

      const analyzedAt = data.analyzedAt ?? new Date().toISOString();
      const analysisResult: CvAnalysisResult = {
        ...data.analysis,
        fileName: selectedName,
        analyzedAt,
      };

      setResult(analysisResult);
      setProgress(100);
      setPhase('complete');

      cvAnalysisContextStore.set({
        improvements: analysisResult.improvements,
        aiRecommendation: analysisResult.improvements[0] ?? null,
        careerScore: Math.round(analysisResult.score * 10),
        sourceFileName: selectedName,
        analyzedAt,
      });

      await incrementCvAnalyzedCount();
    } catch {
      setPhase('error');
      setErrorMessage('Impossible de joindre le serveur. Vérifie ta connexion et réessaie.');
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setProgress(0);
    setStepIndex(0);
    setFileName(null);
    setResult(null);
    setErrorMessage(null);
  }, []);

  return {
    phase,
    progress,
    stepIndex,
    currentStep: ANALYSIS_STEPS[stepIndex],
    fileName,
    result,
    errorMessage,
    startAnalysis,
    reset,
    isIdle: phase === 'idle',
    isAnalyzing: phase === 'analyzing',
    isComplete: phase === 'complete',
    isError: phase === 'error',
  };
}

export type UseCvAnalysisReturn = ReturnType<typeof useCvAnalysis>;
