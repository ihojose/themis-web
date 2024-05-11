import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { AccountModel } from "../../../model/account.model";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Notification } from "../../../include/notification";
import { AccountService } from "../../../services/account.service";
import { AuthService } from "../../../services/auth.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RoleModel } from "../../../model/role.model";
import { DatePipe } from "@angular/common";
import { MESSAGE_ERROR } from "../../../../environments/messages";

@Component( {
  selector: 'themis-edit',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
} )
export class EditComponent {
  public user: FormGroup;
  public loading: boolean = false;
  public idTypes: { [ id: string ]: string } = {
    C: 'Cédula de ciudadanía',
    T: 'Tarjeta de identidad',
    E: 'Cédula de extrangería',
    J: 'NIT Persona Jurídica',
    N: 'NIT Persona Natural',
  };

  constructor( @Inject( MAT_DIALOG_DATA ) public data: { user: AccountModel, roles: RoleModel[] },
               private builder: FormBuilder,
               private accountApi: AccountService,
               private authApi: AuthService,
               private dialog: MatDialogRef<EditComponent> ) {
    this.user = this.builder.group( {
      doctype: [ { value: this.idTypes[ this.data.user.id_type ], disabled: true }, [ Validators.required ] ],
      docnumber: [ { value: this.data.user.identification, disabled: true }, [ Validators.required ] ],
      name: [ { value: this.data.user.name, disabled: false }, [ Validators.required ] ],
      surname: [ { value: this.data.user.surname, disabled: false }, [ Validators.required ] ],
      role: [ { value: this.data.user.role, disabled: false }, [ Validators.required ] ],
      username: [ { value: this.data.user.username, disabled: false }, [ Validators.required ] ],
      email: [ { value: this.data.user.email, disabled: false }, [ Validators.required ] ],
    } );
  }

  public save(): void {
    if ( this.user.invalid ) {
      this.user.markAllAsTouched();
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    this.loading = true;

    this.accountApi.updateUser( {
      identification: this.data.user.identification,
      id_type: this.data.user.id_type,
      name: this.user.get( 'name' )?.value,
      surname: this.user.get( 'surname' )?.value,
      username: this.user.get( 'username' )?.value,
      email: this.user.get( 'email' )?.value,
      role: Number.parseInt( this.user.get( 'role' )?.value ),
      active: this.data.user.active
    } ).subscribe( {
      next: (): void => {
        this.loading = false;
        Notification.success( 'Datos del usuario modificados exitosamente.' );
        this.dialog.close( true );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
