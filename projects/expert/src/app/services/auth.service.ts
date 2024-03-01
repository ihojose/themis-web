import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthModel, TokenModel } from "../model/auth.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  constructor( private http: HttpClient ) {
  }

  /**
   * In this method we can authenticate the user into application.
   * @param data required request data to login.
   */
  public auth( data: AuthModel ): Observable<HttpResponse<TokenModel>> {
    return this.http.post<TokenModel>( environment.api.auth, data, {
      observe: 'response'
    } );
  }
}
