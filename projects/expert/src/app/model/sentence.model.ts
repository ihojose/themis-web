export interface SentenceModel {
  id?: number;
  description: string;
  has_bail: 0 | 1;
  has_agreement: 0 | 1;
}

export interface SentenceLinkModel {
  answer: number;
  sentence: number;
}
