import { VerdictModel } from "./verdict.model";

export interface SessionModel {
  id?: number;
  date?: string;
  account: number;
  law: number;
  verdicts?: VerdictModel;
}
