import { getApiBaseUrl, isAiApiConfigured } from '@/constants/apiConfig';

const DEMO_TRANSCRIPTION =
  'Réponse enregistrée — branchement Whisper disponible lorsque l’API vocale est configurée.';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Appelle Whisper via le backend ; mode démo si l’API n’est pas configurée. */
export async function transcribeInterviewAnswer(): Promise<{ text: string | null }> {
  await wait(900);

  if (!isAiApiConfigured()) {
    return { text: DEMO_TRANSCRIPTION };
  }

  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { text: null };
  }

  try {
    const response = await fetch(`${baseUrl}/api/transcribe-interview-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return { text: null };
    }

    const data = (await response.json()) as { text?: string; transcript?: string };
    const text = (data.text ?? data.transcript ?? '').trim();
    return { text: text || null };
  } catch {
    return { text: null };
  }
}
