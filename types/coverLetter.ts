export interface CoverLetterData {
  jobTitle: string;
  company: string;
  jobOfferId?: string;
  fullName: string;
  introText: string;
  motivationText: string;
  closingText: string;
}

export interface CoverLetterPhraseOption {
  id: string;
  label: string;
  template: string;
}

export const EMPTY_COVER_LETTER: CoverLetterData = {
  jobTitle: '',
  company: '',
  fullName: '',
  introText: '',
  motivationText: '',
  closingText: '',
};
