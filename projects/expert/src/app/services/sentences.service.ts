import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { SentenceModel } from "../model/sentence.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class SentencesService {

  constructor( private http: HttpClient ) {
  }

  public all(): Observable<Response<SentenceModel[]>> {
    return this.http.get<Response<SentenceModel[]>>( environment.api.get_sentences );
  }

  public delete( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_sentence.replace( '{id}', id.toString() ) );
  }

  public save( data: SentenceModel ): Observable<Response<SentenceModel>> {
    return this.http.post<Response<SentenceModel>>( environment.api.add_sentence, data );
  }

  public edit( data: SentenceModel ): Observable<Response<SentenceModel>> {
    return this.http.put<Response<SentenceModel>>( environment.api.edit_sentence.replace( '{id}', data.id!.toString() ), data );
  }
}
