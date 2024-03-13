import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { SessionModel } from "../model/session.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class SessionService {

  constructor( private http: HttpClient ) {
  }

  /**
   * Get All Sessions by user identification
   * @param user user ID
   */
  public getSessions( user: number ): Observable<Response<SessionModel[]>> {
    return this.http.get<Response<SessionModel[]>>( environment.api.get_sessions.replace( '{user}', user.toString() ) );
  }
}
