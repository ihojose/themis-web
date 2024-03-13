import { Component, OnInit } from '@angular/core';
import { RolesService } from "../../services/roles.service";
import { Response } from "../../model/response.model";
import { RoleModel } from "../../model/role.model";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { Notification } from "../../include/notification";

@Component( {
  selector: 'themis-admin-roles',
  standalone: true,
  imports: [],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.scss'
} )
export class AdminRolesComponent implements OnInit {
  public loading: boolean = false;
  public roles: RoleModel[] = [];

  constructor( private api: RolesService ) {
  }

  ngOnInit(): void {
    this.getRoles();
  }

  private getRoles(): void {
    this.loading = true;
    this.api.getRoles().subscribe( {
      next: ( response: Response<RoleModel[]> ): void => {
        this.roles = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }
}
