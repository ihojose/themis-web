import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { RolesService } from "../../../services/roles.service";
import { Notification } from "../../../include/notification";
import { MESSAGE_ERROR } from "../../../../environments/messages";

@Component( {
  selector: 'themis-add',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
} )
export class AddComponent {
  public form: FormGroup;
  public loading: boolean = false;

  constructor( private dialog: MatDialogRef<AddComponent>,
               private builder: FormBuilder,
               private icons: FaIconLibrary,
               private api: RolesService ) {
    this.icons.addIconPacks( fas );

    this.form = this.builder.group( {
      name: [ { value: '', disabled: false }, [ Validators.required ] ],
      description: [ { value: '', disabled: false }, [ Validators.required ] ],
    } );
  }

  public addRole(): void {
    if ( this.form.invalid ) {
      this.form.markAllAsTouched();
      return
    }

    this.loading = true;

    this.api.addRole( {
      name: this.form.get( 'name' )?.value,
      description: this.form.get( 'description' )?.value
    } ).subscribe( {
      next: (): void => {
        this.loading = false;
        Notification.success( 'Nuevo rol registrado' );
        this.dialog.close( true );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }
}
