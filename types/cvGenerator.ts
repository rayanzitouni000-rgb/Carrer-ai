export interface GeneratedCvExperience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

export interface GeneratedCvEducation {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface GeneratedCvData {
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  experiences: GeneratedCvExperience[];
  education: GeneratedCvEducation[];
  skills: string[];
}

export const EMPTY_GENERATED_CV: GeneratedCvData = {
  fullName: '',
  email: '',
  phone: '',
  headline: '',
  summary: '',
  experiences: [],
  education: [],
  skills: [],
};
