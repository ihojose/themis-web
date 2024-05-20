import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'bailtime',
  standalone: true
} )
export class BailTimePipe implements PipeTransform {

  transform( value: number ): string {
    let years: number = value / 12;

    return Number.isInteger( years ) ? `${ years } años` : `${ Math.round( years ) > years ? Math.round( years ) - 1 : Math.round( years ) } años y ${ Math.round( Math.abs( Math.round( years ) - years ) * 12 ) } meses`;
  }
}
