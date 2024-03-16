import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RolesService } from "../../../services/roles.service";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { RoleModel } from "../../../model/role.model";
import { Response } from "../../../model/response.model";
import { Notification } from "../../../include/notification";
import { MESSAGE_ERROR } from "../../../../environments/messages";

@Component( {
  selector: 'themis-edit',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
} )
export class EditComponent {
  public form: FormGroup;
  public loading: boolean = false;
  public role?: RoleModel;

  constructor( private dialog: MatDialogRef<EditComponent>,
               private builder: FormBuilder,
               private icons: FaIconLibrary,
               private api: RolesService,
               @Inject( MAT_DIALOG_DATA ) private data: RoleModel ) {
    this.icons.addIconPacks( fas );

    this.role = this.data;

    this.form = this.builder.group( {
      name: [ { value: this.role.name, disabled: false }, [ Validators.required ] ],
      description: [ { value: this.role.description, disabled: false }, [ Validators.required ] ],
    } );
  }

  public modify(): void {
    if ( this.form.invalid ) {
      this.form.markAllAsTouched();
      return
    }

    this.loading = true;

    // set entity
    this.role!.name = this.form.get( 'name' )?.value;
    this.role!.description = this.form.get( 'description' )?.value;

    this.api.modifyRole( this.role! ).subscribe( {
      next: ( response: Response<RoleModel> ): void => {
        this.loading = false;
        Notification.success( `Rol ${ this.role?.name } modificado exitosamente.` );
        this.dialog.close( true );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }
}
