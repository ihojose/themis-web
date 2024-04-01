import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { AggravatingModel } from "../model/aggravating.model";
import { environment } from "../../environments/environment.development";
import { AnswerModel } from "../model/answer.model";
import { SentenceLinkModel } from "../model/sentence.model";

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
   * Modify Rule
   * @param data Aggravating entity
   */
  public editRule( data: AggravatingModel ): Observable<Response<AggravatingModel>> {
    return this.http.put<Response<AggravatingModel>>( environment.api.edit_aggravating.replace( '{id}', data.id!.toString() ), data );
  }

  /**
   * Delete rule from api
   * @param id Rule ID
   */
  public deleteRule( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_aggravating.replace( '{id}', id.toString() ) );
  }

  /**
   * Add rule answer
   * @param data Answer entity
   */
  public addAnswer( data: AnswerModel ): Observable<Response<AnswerModel>> {
    return this.http.post<Response<AnswerModel>>( environment.api.add_asnwer, data );
  }

  /**
   * Modify rule answer
   * @param data Answer entity
   */
  public editAnswer( data: AnswerModel ): Observable<Response<AnswerModel>> {
    return this.http.put<Response<AnswerModel>>( environment.api.edit_asnwer.replace( '{id}', data.id!.toString() ), data );
  }

  /**
   * Delete rule answer
   * @param id Answer ID
   */
  public deleteAnswer( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_asnwer.replace( '{id}', id.toString() ) );
  }

  /**
   * Add Sentence association
   * @param answer Answer ID
   * @param sentence Sentence ID
   */
  public linkSentence( answer: number, sentence: number ): Observable<Response<SentenceLinkModel>> {
    return this.http.post<Response<SentenceLinkModel>>( environment.api.ref_sentence, { answer, sentence } );
  }

  /**
   * Delete Sentence association
   * @param answer Answer ID
   * @param sentence Sentence ID
   */
  public deleteLinkSentence( answer: number, sentence: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_ref_sentence.replace( '{1}', answer.toString() ).replace( '{2}', sentence.toString() ) );
  }
}
