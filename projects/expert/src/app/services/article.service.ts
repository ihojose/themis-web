import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { ArticleModel } from "../model/article.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class ArticleService {

  constructor( private http: HttpClient ) {
  }

  public getByLaw( law: number ): Observable<Response<ArticleModel[]>> {
    return this.http.get<Response<ArticleModel[]>>( environment.api.get_articles.replace( '{id}', law.toString() ) );
  }

  public add( data: ArticleModel ): Observable<Response<ArticleModel>> {
    return this.http.post<Response<ArticleModel>>( environment.api.add_article, data );
  }

  public edit( data: ArticleModel ): Observable<Response<ArticleModel>> {
    return this.http.put<Response<ArticleModel>>( environment.api.edit_article.replace( '{id}', data.id!.toString() ), data );
  }

  public delete( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_article.replace( '{id}', id.toString() ) );
  }
}
