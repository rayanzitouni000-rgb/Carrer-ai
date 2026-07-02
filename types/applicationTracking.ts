export type ApplicationSource = 'job_match' | 'manual';

export interface ApplicationEntry {
  id: string;
  date: string;
  company: string;
  jobTitle: string;
  jobOfferId?: string;
  source: ApplicationSource;
}
