import { getApiBaseUrl, isAiApiConfigured } from '@/constants/apiConfig';
import type { CompanyBriefing } from '@/types/interviewSimulator';

export type CompanyBriefErrorCode = 'NOT_CONFIGURED' | 'QUOTA_EXCEEDED' | 'API' | 'NETWORK';

export type FetchCompanyBriefResult =
  | { ok: true; brief: CompanyBriefing }
  | { ok: false; code: CompanyBriefErrorCode; message?: string };

interface CompanyBriefApiPayload {
  brief?: Omit<CompanyBriefing, 'generatedAt'>;
  error?: string;
  message?: string;
}

export async function fetchCompanyBrief(companyName: string): Promise<FetchCompanyBriefResult> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl || !isAiApiConfigured()) {
    return { ok: false, code: 'NOT_CONFIGURED', message: 'API non configurée' };
  }

  try {
    const response = await fetch(`${baseUrl}/api/generate-company-brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName: companyName.trim() }),
    });

    const payload = (await response.json()) as CompanyBriefApiPayload;

    if (response.status === 429 && payload.error === 'QUOTA_EXCEEDED') {
      return { ok: false, code: 'QUOTA_EXCEEDED' };
    }

    if (!response.ok || !payload.brief) {
      return {
        ok: false,
        code: 'API',
        message: payload.error ?? payload.message ?? 'Erreur lors de la génération',
      };
    }

    return {
      ok: true,
      brief: {
        ...payload.brief,
        generatedAt: new Date().toISOString(),
      },
    };
  } catch {
    return { ok: false, code: 'NETWORK', message: 'Impossible de joindre le serveur' };
  }
}
