import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { RoleModel } from "../model/role.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class RolesService {

  constructor( private http: HttpClient ) {
  }

  /**
   * Get all roles from API.
   */
  public getRoles(): Observable<Response<RoleModel[]>> {
    return this.http.get<Response<RoleModel[]>>( environment.api.get_roles );
  }

  /**
   * Get one role by id.
   * @param id Role ID.
   */
  public getRole( id: number ): Observable<Response<RoleModel>> {
    return this.http.get<Response<RoleModel>>( environment.api.get_role.replace( '{id}', id.toString() ) );
  }

  /**
   * Delete role element from API.
   * @param id Role ID
   */
  public deleteRole( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_role.replace( '{id}', id.toString() ) );
  }

  /**
   * Add role element from API.
   * @param data Role Entity.
   */
  public addRole( data: RoleModel ): Observable<any> {
    return this.http.post<any>( environment.api.add_role, data );
  }

  /**
   * Modify role element from API.
   * @param data Role entity
   */
  public modifyRole( data: RoleModel ): Observable<Response<RoleModel>> {
    return this.http.put<Response<RoleModel>>( environment.api.edit_role.replace( '{id}', data.id ), data );
  }
}
