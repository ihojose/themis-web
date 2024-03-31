export interface AnswerModel {
  id?: number;
  description: string;
  aggravating: number;
  next_aggravating?: number | null;
}
