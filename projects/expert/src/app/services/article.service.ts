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
}
