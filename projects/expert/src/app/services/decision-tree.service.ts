import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { AggravatingModel } from "../model/aggravating.model";
import { environment } from "../../environments/environment.development";
import { AnswerModel } from "../model/answer.model";

@Injectable( {
  providedIn: 'root'
} )
export class DecisionTreeService {

  constructor( private http: HttpClient ) {
  }

  /**
   * Get all aggravating by article
   * @param id artciel ID
   */
  public getByArticle( id: number ): Observable<Response<AggravatingModel[]>> {
    return this.http.get<Response<AggravatingModel[]>>( environment.api.get_aggravating_by_article.replace( '{id}', id.toString() ) );
  }

  /**
   * Get All Rules (Aggravating list)
   */
  public getRules(): Observable<Response<AggravatingModel[]>> {
    return this.http.get<Response<AggravatingModel[]>>( environment.api.get_aggravating_list );
  }

  /**
   * Add Rule in decision tree (aggravating)
   * @param data Aggravating entity
   */
  public addRule( data: AggravatingModel ): Observable<Response<AggravatingModel>> {
    return this.http.post<Response<AggravatingModel>>( environment.api.add_aggravating, data );
  }

  /**
   * Add rule answer
   * @param data Answer entity
   */
  public addAnswer( data: AnswerModel ): Observable<Response<AnswerModel>> {
    return this.http.post<Response<AnswerModel>>( environment.api.add_asnwer, data );
  }

  public deleteRule( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_aggravating.replace( '{id}', id.toString() ) );
  }
}
