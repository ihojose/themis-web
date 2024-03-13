import { JwtModel } from "../model/jwt.model";
import { LocalStorageService } from "../services/local-storage.service";
import { AUTH_KEY } from "../../environments/constants";

export class Jwt {

  /**
   * Decode JWT code from token authentication.
   * @param token jwt code
   */
  public static toObject( token: string ): JwtModel | undefined {
    if ( token === undefined || token === null || token === '' ) {
      return undefined;
    }

    token = token.split( '.' )[ 1 ];
    token = token.replace( /-/g, '+' ).replace( /_/g, '/' );

    switch ( token.length % 4 ) {
      case 0:
        break;
      case 2:
        token += '==';
        break;
      case 3:
        token += '=';
        break;
      default:
        console.error( `Invalid request token [${ token }]` );
        break;
    }

    token = ( token + '===' ).substring( 0, token.length + ( token.length % 4 ) );
    token = token.replace( /-/g, '+' ).replace( /_/g, '/' );
    token = decodeURIComponent( atob( token ) );

    return JSON.parse( token ) as JwtModel;
  }

  public static user( storage: LocalStorageService ): JwtModel | undefined {
    return this.toObject( storage.get( AUTH_KEY ) );
  }
}
