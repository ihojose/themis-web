import { Pipe, PipeTransform } from '@angular/core';
import { ID_TYPE } from "../../environments/constants";

@Pipe( {
  name: 'idType',
  standalone: true
} )
export class IdTypePipe implements PipeTransform {
  transform( value: string ): string {
    return ID_TYPE[ value ]! || value;
  }
}
