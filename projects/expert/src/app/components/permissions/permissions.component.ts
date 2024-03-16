import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { RoleModel } from "../../model/role.model";
import { MatMenuModule } from "@angular/material/menu";
import { PermissionModel } from "../../model/permission.model";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RolesService } from "../../services/roles.service";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { PermissionsService } from "../../services/permissions.service";
import { ContentUtil } from "../../include/content.util";
import { Modal } from "../../include/modal";

@Component( {
  selector: 'themis-permissions',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
} )
export class PermissionsComponent {
  public loading: boolean = false;
  public role: RoleModel;
  public selected: number = 0;
  public enableAdd: boolean = false;
  public add: { name: string, description: string };

  constructor( private icons: FaIconLibrary,
               private roleApi: RolesService,
               private api: PermissionsService,
               @Inject( MAT_DIALOG_DATA ) private data: RoleModel ) {
    this.icons.addIconPacks( fas );

    this.role = this.data;
    this.add = { name: '', description: '' };
  }

  /**
   * Get role to update view
   * @param id Role ID
   * @private
   */
  private getRole( id: number ): void {
    this.roleApi.getRole( id ).subscribe( {
      next: ( response: Response<RoleModel> ): void => {
        this.role = response.result!;
      },
      error: err => {
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Start permission element modification
   * @param p Permission entity
   */
  public edit( p: PermissionModel ): void {
    this.selected = p.id!;
  }

  /**
   * Cancel modification process
   * @param role Role entity
   */
  public cancel( role: RoleModel ): void {
    this.selected = 0;
    this.enableAdd = false;
    this.getRole( role.id! );
  }

  /**
   * Add Permission element to role.
   */
  public addPermission(): void {
    if ( ContentUtil.isEmpty( this.add.name ) || ContentUtil.isEmpty( this.add.description ) ) {
      Notification.danger( 'El nombre y la descripción son requeridos.' );
      return;
    }

    this.loading = true;

    this.api.add( {
      name: this.add.name,
      description: this.add.description,
      role: this.role.id!
    } ).subscribe( {
      next: (): void => {
        this.loading = false;
        Notification.success( 'Permiso agregado exitosamente.' );
        this.add = { name: '', description: '' };
        this.enableAdd = false;
        this.getRole( this.role.id! );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  /**
   * Start to add permission.
   */
  public startAdd(): void {
    this.enableAdd = true;
  }

  public delete( p: PermissionModel ): void {
    Modal.question( {
      title: `¿Deseas eliminar el permiso ${ p.name }?`,
      confirmText: 'Eliminar',
      onConfirm: (): void => {
        this.api.delete( p.id! ).subscribe( {
          next: (): void => {
            Notification.success( 'Permiso eliminado exitosamente.' );
            this.getRole( this.role.id! );
          },
          error: err => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } );
      }
    } ).then();
  }
}
