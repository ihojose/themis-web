import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { AccountModel } from "../../model/account.model";
import { AccountService } from "../../services/account.service";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { DatePipe } from "@angular/common";
import { IdTypePipe } from "../../pipes/id-type.pipe";
import { UserStatusPipe } from "../../pipes/user-status.pipe";
import { RolesService } from "../../services/roles.service";
import { RoleModel } from "../../model/role.model";
import { UserRolePipe } from "../../pipes/user-role.pipe";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { EditComponent } from "./edit/edit.component";
import { Modal } from "../../include/modal";

@Component( {
  selector: 'themis-admin-accounts',
  standalone: true,
  imports: [
    FaIconComponent,
    DatePipe,
    IdTypePipe,
    UserStatusPipe,
    UserRolePipe,
    MatMenu,
    MatMenuTrigger,
    MatDialogModule
  ],
  templateUrl: './admin-accounts.component.html',
  styleUrl: './admin-accounts.component.scss'
} )
export class AdminAccountsComponent implements OnInit {
  public accounts: AccountModel[] = [];
  public roles: { [ key: number ]: RoleModel } = {};
  public loading: boolean = false;

  constructor( private api: AccountService,
               private roleApi: RolesService,
               private dialog: MatDialog ) {
  }

  ngOnInit(): void {
    this.getRoles();
  }

  /**
   * Alert to ask if superuser are sure to change another user password
   * @param data account data
   */
  public userStatus( data: AccountModel ): void {
    Modal.question( {
      title: `${ data.active ? 'Deshabilitar' : 'Habilitar' } usuario`,
      text: `¿Estás seguro(a) de ${ data.active ? 'deshabilitar' : 'habilitar' } la cuenta de usuario de ${ data.name } ${ data.surname }?`,
      confirmText: data.active ? 'Deshabilitar' : 'Habilitar',
      onConfirm: (): void => {
        Modal.loading().then();
        data.active = Math.abs( data.active! - 1 );
        this.api.updateUser( data ).subscribe( {
          next: (): void => {
            Notification.success( `${ data.name } ${ data.active ? 'habilitado' : 'deshabilitado' } exitosamente.` );
            this.getAccounts();
          },
          error: ( err ): void => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } );
      }
    } ).then();
  }

  /**
   * Dialog to modify user data
   * @param data account data
   */
  public openEdit( data: AccountModel ): void {
    this.dialog.open( EditComponent, {
      width: '800px',
      disableClose: true,
      data: {
        user: data,
        roles: Object.values( this.roles )
      }
    } ).afterClosed().subscribe( ( r: boolean ): void => {
      if ( r ) {
        this.getAccounts();
      }
    } );
  }

  /**
   * Get all accounts registered
   * @private
   */
  private getAccounts(): void {
    this.loading = true;
    this.api.getAccounts().subscribe( {
      next: ( response: Response<AccountModel[]> ): void => {
        this.loading = false;
        this.accounts = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Get all the roles
   * @private
   */
  private getRoles(): void {
    this.roleApi.getRoles().subscribe( {
      next: ( response: Response<RoleModel[]> ): void => {
        for ( let role of response.result! ) {
          this.roles[ role.id! ] = role;
        }

        this.getAccounts();
      },
      error: err => {
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
