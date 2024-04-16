import { Pipe, PipeTransform } from '@angular/core';
import { RoleModel } from "../model/role.model";

@Pipe( {
  name: 'userRole',
  standalone: true
} )
export class UserRolePipe implements PipeTransform {
  transform( value: number, roles: { [ key: number ]: RoleModel } ): string {
    return roles[ value ] ? roles[ value ].name : value.toString();
  }
}
