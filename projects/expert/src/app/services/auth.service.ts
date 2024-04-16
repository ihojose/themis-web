import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthModel, TokenModel } from "../model/auth.model";
import { environment } from "../../environments/environment.development";
import { AccountModel } from "../model/account.model";
import { Response } from "../model/response.model";

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

  /**
   * Create user account
   * @param data Account Entity
   */
  public register( data: AccountModel ): Observable<Response<AccountModel>> {
    return this.http.post<Response<AccountModel>>( environment.api.register, data );
  }

  /**
   * Check usernae or email availability
   * @param username Username or Email
   */
  public check( username: string ): Observable<any> {
    return this.http.get<any>( environment.api.check_account.replace( '{username}', username ) );
  }
}
