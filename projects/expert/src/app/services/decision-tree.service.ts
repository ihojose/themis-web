import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { AggravatingModel } from "../model/aggravating.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class DecisionTreeService {

  constructor( private http: HttpClient ) {
  }

  public getByArticle( id: number ): Observable<Response<AggravatingModel[]>> {
    return this.http.get<Response<AggravatingModel[]>>( environment.api.get_aggravating_by_article.replace( '{id}', id.toString() ) );
  }

  public getRules(): Observable<Response<AggravatingModel[]>> {
    return this.http.get<Response<AggravatingModel[]>>( environment.api.get_aggravating_list );
  }
}
