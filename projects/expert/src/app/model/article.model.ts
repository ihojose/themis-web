import { AggravatingModel } from "./aggravating.model";

export interface ArticleModel {
  id?: number;
  number: number;
  ordinal: number;
  description: string;
  min_months: number;
  max_months: number;
  law: number;
  aggravating_factors?: AggravatingModel[];
}
