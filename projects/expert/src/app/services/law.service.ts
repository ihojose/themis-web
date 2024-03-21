import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../model/response.model";
import { LawModel } from "../model/law.model";
import { environment } from "../../environments/environment.development";

@Injectable( {
  providedIn: 'root'
} )
export class LawService {

  constructor( private http: HttpClient ) {
  }

  /**
   * Get All Laws.
   */
  public getAll(): Observable<Response<LawModel[]>> {
    return this.http.get<Response<LawModel[]>>( environment.api.get_laws );
  }

  /**
   * Get single Law information.
   * @param id Law ID
   */
  public get( id: number ): Observable<Response<LawModel>> {
    return this.http.get<Response<LawModel>>( environment.api.get_law.replace( '{id}', id.toString() ) );
  }

  /**
   * Add a new Law
   * @param data Law Entity
   */
  public add( data: LawModel ): Observable<Response<LawModel>> {
    return this.http.post<Response<LawModel>>( environment.api.add_law, data );
  }

  /**
   * Modify law data.
   * @param data Law Entity
   */
  public edit( data: LawModel ): Observable<Response<LawModel>> {
    return this.http.put<Response<LawModel>>( environment.api.edit_law.replace( '{id}', data.id!.toString() ), data );
  }

  /**
   * Delete law element, before this, delete all relations is necessary
   * @param id Law ID
   */
  public delete( id: number ): Observable<Response<any>> {
    return this.http.delete<Response<any>>( environment.api.delete_law.replace( '{id}', id.toString() ) );
  }
}
