import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'userStatus',
  standalone: true
} )
export class UserStatusPipe implements PipeTransform {

  transform( value: number ): string {
    return value === 1 ? 'ACTIVO' : 'INACTIVO';
  }
}
