import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AccountModel } from "../model/account.model";
import { Response } from "../model/response.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class AccountService {

  constructor( private http: HttpClient ) {
  }

  /**
   * Get all user accounts
   */
  public getAccounts(): Observable<Response<AccountModel[]>> {
    return this.http.get<Response<AccountModel[]>>( environment.api.get_accounts );
  }

  /**
   * Modify user data (without password)
   * @param data User account data
   */
  public updateUser( data: AccountModel ): Observable<Response<AccountModel>> {
    return this.http.put<Response<AccountModel>>( environment.api.edit_account.replace( '{id}', data.identification.toString() ), data );
  }
}
