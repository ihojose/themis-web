import { AnswerModel } from "./answer.model";

export interface AggravatingModel {
  id?: number;
  question: string;
  article: number;
  articleText?: string;
  answers?: AnswerModel[];
}
