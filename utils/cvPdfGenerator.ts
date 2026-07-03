import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { GeneratedCvData } from '@/types/cvGenerator';

export type CvTemplateId = 'classic';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderExperience(exp: GeneratedCvData['experiences'][number]): string {
  const header = [escapeHtml(exp.jobTitle), escapeHtml(exp.company)]
    .filter(Boolean)
    .join(' — ');
  const duration = exp.duration?.trim()
    ? `<span class="duration">${escapeHtml(exp.duration)}</span>`
    : '';
  const description = exp.description?.trim()
    ? `<p class="desc">${escapeHtml(exp.description).replace(/\n/g, '<br/>')}</p>`
    : '';

  return `
    <div class="item">
      <div class="item-head">
        <span class="item-title">${header}</span>
        ${duration}
      </div>
      ${description}
    </div>`;
}

function renderEducation(edu: GeneratedCvData['education'][number]): string {
  const parts = [escapeHtml(edu.degree), escapeHtml(edu.school)].filter(Boolean).join(' — ');
  const year = edu.year?.trim() ? `<span class="duration">${escapeHtml(edu.year)}</span>` : '';
  return `
    <div class="item">
      <div class="item-head">
        <span class="item-title">${parts}</span>
        ${year}
      </div>
    </div>`;
}

export function generateCvHtml(
  data: GeneratedCvData,
  templateId: CvTemplateId = 'classic'
): string {
  void templateId; // réservé pour d'autres styles de CV à l'avenir

  const contactParts = [data.email, data.phone]
    .map((v) => v.trim())
    .filter(Boolean)
    .map(escapeHtml)
    .join(' · ');

  const summary = data.summary.trim()
    ? `<section><h2>Profil</h2><p class="summary">${escapeHtml(data.summary).replace(/\n/g, '<br/>')}</p></section>`
    : '';

  const experiences = data.experiences.filter((e) => e.jobTitle.trim() || e.company.trim());
  const experienceSection = experiences.length
    ? `<section><h2>Expériences</h2>${experiences.map(renderExperience).join('')}</section>`
    : '';

  const educationSection = data.education.length
    ? `<section><h2>Formation</h2>${data.education.map(renderEducation).join('')}</section>`
    : '';

  const skills = data.skills.filter((s) => s.trim());
  const skillsSection = skills.length
    ? `<section><h2>Compétences</h2><div class="skills">${skills
        .map((s) => `<span class="chip">${escapeHtml(s)}</span>`)
        .join('')}</div></section>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1a1a2e;
    margin: 0;
    padding: 40px 44px;
    font-size: 13px;
    line-height: 1.5;
  }
  header { border-bottom: 2px solid #1D4ED8; padding-bottom: 16px; margin-bottom: 20px; }
  h1 { font-size: 26px; margin: 0 0 4px; color: #0f172a; }
  .headline { font-size: 15px; color: #1D4ED8; font-weight: 600; margin: 0 0 8px; }
  .contact { font-size: 12px; color: #555; }
  section { margin-bottom: 18px; }
  h2 {
    font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em;
    color: #1D4ED8; border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px; margin: 0 0 10px;
  }
  .item { margin-bottom: 12px; }
  .item-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .item-title { font-weight: 600; color: #0f172a; }
  .duration { font-size: 11px; color: #777; white-space: nowrap; }
  .desc { margin: 4px 0 0; color: #444; }
  .summary { margin: 0; color: #444; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    background: #eff6ff; color: #1D4ED8; border-radius: 999px;
    padding: 4px 10px; font-size: 11px;
  }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(data.fullName || 'Ton nom')}</h1>
    ${data.headline.trim() ? `<p class="headline">${escapeHtml(data.headline)}</p>` : ''}
    ${contactParts ? `<div class="contact">${contactParts}</div>` : ''}
  </header>
  ${summary}
  ${experienceSection}
  ${educationSection}
  ${skillsSection}
</body>
</html>`;
}

export async function generateAndSharePdf(
  data: GeneratedCvData,
  templateId: CvTemplateId = 'classic'
): Promise<void> {
  const html = generateCvHtml(data, templateId);
  const { uri } = await Print.printToFileAsync({ html });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Partager mon CV',
      UTI: 'com.adobe.pdf',
    });
  }
}
