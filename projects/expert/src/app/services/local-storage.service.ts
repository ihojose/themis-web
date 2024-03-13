import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";

@Injectable( {
  providedIn: 'root'
} )
export class LocalStorageService {

  constructor( @Inject( LOCAL_STORAGE ) private storage: StorageService ) {
  }

  public save( key: string, value: string ): void {
    this.storage.set( key, value );
  }

  public get( key: string ): string {
    return this.storage.get( key );
  }

  public delete( key: string ): void {
    this.storage.remove( key );
  }
}
