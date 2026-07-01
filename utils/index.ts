export function formatPercentage(value: number): string {
  return `${Math.round(Math.min(100, Math.max(0, value)))}%`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getMatchColor(score: number): string {
  if (score >= 85) return '#10B981';
  if (score >= 70) return '#F59E0B';
  return '#EF4444';
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
