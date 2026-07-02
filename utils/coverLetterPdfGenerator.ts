import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { CoverLetterData } from '@/types/coverLetter';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatLetterDate(): string {
  return new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function paragraph(text: string): string {
  if (!text.trim()) return '';
  return `<p>${escapeHtml(text).replace(/\n/g, '<br/>')}</p>`;
}

export function generateCoverLetterHtml(data: CoverLetterData): string {
  const subject = `Candidature — ${data.jobTitle}`.trim();
  const signature = data.fullName.trim() || 'Ton nom';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #1a1a2e;
    margin: 0;
    padding: 48px 52px;
    font-size: 13px;
    line-height: 1.65;
  }
  .sender { margin-bottom: 28px; font-weight: 600; }
  .date { margin-bottom: 28px; color: #444; }
  .recipient { margin-bottom: 28px; }
  .object { margin-bottom: 24px; font-weight: 600; }
  p { margin: 0 0 14px; text-align: justify; }
  .signature { margin-top: 28px; font-weight: 600; }
</style>
</head>
<body>
  <div class="sender">${escapeHtml(signature)}</div>
  <div class="date">${escapeHtml(formatLetterDate())}</div>
  <div class="recipient">
    <div>${escapeHtml(data.company || 'Entreprise')}</div>
  </div>
  <div class="object">Objet : ${escapeHtml(subject)}</div>
  ${paragraph(data.introText)}
  ${paragraph(data.motivationText)}
  ${paragraph(data.closingText)}
  <div class="signature">${escapeHtml(signature)}</div>
</body>
</html>`;
}

export async function generateAndShareCoverLetterPdf(data: CoverLetterData): Promise<void> {
  const html = generateCoverLetterHtml(data);
  const { uri } = await Print.printToFileAsync({ html });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Partager ma lettre de motivation',
      UTI: 'com.adobe.pdf',
    });
  }
}
