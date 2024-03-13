import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { HistoryModel } from "../model/history.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class HistoryService {

  constructor( private http: HttpClient ) {
  }

  /**
   * Get history by session
   * @param session session ID
   */
  public getSessionHistory( session: number ): Observable<Response<HistoryModel[]>> {
    return this.http.get<Response<HistoryModel[]>>( environment.api.get_history.replace( '{session}', session.toString() ) );
  }
}
