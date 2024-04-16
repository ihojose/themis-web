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

@Component( {
  selector: 'themis-admin-accounts',
  standalone: true,
  imports: [
    FaIconComponent,
    DatePipe,
    IdTypePipe,
    UserStatusPipe,
    UserRolePipe
  ],
  templateUrl: './admin-accounts.component.html',
  styleUrl: './admin-accounts.component.scss'
} )
export class AdminAccountsComponent implements OnInit {
  public accounts: AccountModel[] = [];
  public roles: { [ key: number ]: RoleModel } = {};
  public loading: boolean = false;

  constructor( private api: AccountService,
               private roleApi: RolesService ) {
  }

  ngOnInit(): void {
    this.getRoles();
  }

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
