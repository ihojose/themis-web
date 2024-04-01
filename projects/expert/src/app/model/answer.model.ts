import { SentenceLinkModel } from "./sentence.model";

export interface AnswerModel {
  id?: number;
  description: string;
  aggravating: number;
  next_aggravating?: number | null;
  has_sentence?: SentenceLinkModel;
}
