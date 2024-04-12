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
  public all( user: number ): Observable<Response<SessionModel[]>> {
    return this.http.get<Response<SessionModel[]>>( environment.api.get_sessions.replace( '{user}', user.toString() ) );
  }

  /**
   * Add new session item
   * @param data Session Entity
   */
  public add( data: SessionModel ): Observable<Response<SessionModel>> {
    return this.http.post<Response<SessionModel>>( environment.api.add_session, data );
  }

  /**
   * Delete session item
   * @param id session ID
   */
  public delete( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_session.replace( '{id}', id.toString() ) );
  }
}
