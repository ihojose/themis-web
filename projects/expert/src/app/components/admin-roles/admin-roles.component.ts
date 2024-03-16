import { Component, OnInit } from '@angular/core';
import { RolesService } from "../../services/roles.service";
import { Response } from "../../model/response.model";
import { RoleModel } from "../../model/role.model";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { Notification } from "../../include/notification";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { Modal } from "../../include/modal";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddComponent } from "./add/add.component";
import { EditComponent } from "./edit/edit.component";
import { PermissionsComponent } from "../permissions/permissions.component";

@Component( {
  selector: 'themis-admin-roles',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatMenuModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.scss'
} )
export class AdminRolesComponent implements OnInit {
  public loading: boolean = false;
  public roles: RoleModel[] = [];

  constructor( private api: RolesService, private icons: FaIconLibrary, private dialog: MatDialog ) {
    this.icons.addIconPacks( fas );
  }

  ngOnInit(): void {
    this.getRoles();
  }

  /**
   * Get role list
   * @private
   */
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

  /**
   * Array size in frontend.
   * @param val Array element
   */
  public size( val: any[] ): number {
    return val.length || 0;
  }

  /**
   * Delete selected role
   * @param role Role object.
   */
  public openDelete( role: RoleModel ): void {
    if ( role.permissions?.length || 0 > 0 ) {
      Notification.danger( 'No puedes eliminar un rol que tiene asociados varios permisos.' );
      return
    }

    Modal.question( {
      title: `¿Deseas eliminar el rol ${ role.name }?`,
      confirmText: 'Eliminar',
      onConfirm: (): void => {
        Modal.loading().then();
        this.api.deleteRole( role.id! ).subscribe( {
          next: (): void => {
            Notification.success( 'Rol eliminado exitosamente.' );
            this.getRoles();
          },
          error: ( err ): void => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } )
      }
    } ).then();
  }

  /**
   * Add role dialog.
   */
  public openAdd(): void {
    this.dialog.open( AddComponent, {
      disableClose: true
    } ).afterClosed().subscribe( ( res ): void => {
      if ( res ) {
        this.getRoles();
      }
    } );
  }

  /**
   * Modify role item dialog.
   * @param role Role entity
   */
  public openEdit( role: RoleModel ): void {
    this.dialog.open( EditComponent, {
      disableClose: true,
      data: role
    } ).afterClosed().subscribe( ( res ): void => {
      if ( res ) {
        this.getRoles();
      }
    } );
  }

  /**
   * Show permissions logic dialog.
   * @param role Role entity
   */
  public openPermissions( role: RoleModel ): void {
    this.dialog.open( PermissionsComponent, {
      disableClose: true,
      width: '900px',
      data: role
    } ).afterClosed().subscribe( (): void => {
      this.getRoles();
    } );
  }
}
