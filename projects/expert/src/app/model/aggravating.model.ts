import { AnswerModel } from "./answer.model";

export interface AggravatingModel {
  id?: number;
  question: string;
  article: number;
  answers?: AnswerModel[];
}
