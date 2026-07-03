export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Âge minimum 14 ans */
export function getMaxDateOfBirth(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 14);
  return date;
}

export function getMinDateOfBirth(): Date {
  return new Date(1940, 0, 1);
}

export function formatDateOfBirthLabel(iso: string): string {
  return parseISODate(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDefaultDateOfBirth(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 22);
  return toISODate(date);
}
