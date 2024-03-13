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

  public getRoles(): Observable<Response<RoleModel[]>> {
    return this.http.get<Response<RoleModel[]>>( environment.api.get_roles );
  }
}
