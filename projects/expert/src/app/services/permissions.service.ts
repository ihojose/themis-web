import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PermissionModel } from "../model/permission.model";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class PermissionsService {

  constructor( private http: HttpClient ) {
  }

  public add( data: PermissionModel ): Observable<any> {
    return this.http.post<any>( environment.api.add_permission, data );
  }

  public delete( id: number ): Observable<any> {
    return this.http.delete<any>( environment.api.delete_permission.replace( '{id}', id.toString() ) );
  }
}
