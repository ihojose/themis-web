import { SentenceModel } from "./sentence.model";

export interface HistoryModel {
  id?: number;
  date?: string;
  session: number;
  answer: number;
  answer_text?: string;
  aggravating?: string;
  aggravating_id?: number;
  next?: number;
  sentence?: SentenceModel;
}
