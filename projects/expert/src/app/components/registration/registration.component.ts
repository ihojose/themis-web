import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Notification } from "../../include/notification";
import { AuthService } from "../../services/auth.service";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { createMask, InputMaskModule, InputmaskOptions } from "@ngneat/input-mask";

@Component( {
  selector: 'themis-registration',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FaIconComponent,
    InputMaskModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
} )
export class RegistrationComponent {
  public form: FormGroup;
  public loading: boolean = false;
  public idMask: InputmaskOptions<any> = createMask( { alias: 'integer', rightAlign: false, placeholder: '' } );
  public emailMask: InputmaskOptions<any> = createMask( { alias: 'email' } );
  public errorAvailability: { [ id: string ]: boolean } = {
    username: false,
    email: false,
    identification: false
  };

  constructor( private builder: FormBuilder, private api: AuthService, private router: Router ) {
    this.form = this.builder.group( {
      email: [ { value: '', disabled: false }, [ Validators.required ] ],
      identification: [ { value: '', disabled: false }, [ Validators.required ] ],
      id_type: [ { value: 'C', disabled: false }, [ Validators.required ] ],
      username: [ { value: '', disabled: false }, [ Validators.required ] ],
      name: [ { value: '', disabled: false }, [ Validators.required ] ],
      surname: [ { value: '', disabled: false }, [ Validators.required ] ],
      password: [ { value: '', disabled: false }, [ Validators.required ] ],
      re_password: [ { value: '', disabled: false }, [ Validators.required ] ]
    } );
  }

  /**
   * Check avalability
   * @param item Identification, Username or Email
   */
  public check( item: string ): void {
    this.api.check( this.form.get( item )?.value ).subscribe( {
      next: (): void => {
        this.errorAvailability[ item ] = false;
      },
      error: ( err ): void => {
        this.errorAvailability[ item ] = true;
      }
    } )
  }

  /**
   * Send data to account creation.
   */
  public submit(): void {
    if ( this.form.invalid ) {
      this.form.markAllAsTouched();
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    if ( this.form.get( 'password' )?.value !== this.form.get( 're_password' )?.value ) {
      Notification.danger( 'Las contraseñas no coinciden.' );
      return;
    }

    if ( this.errorAvailability[ 'email' ] ) {
      Notification.danger( 'La dirección de correo eletrónico ya está registrada.' );
      return;
    }

    if ( this.errorAvailability[ 'username' ] ) {
      Notification.danger( 'El nickname ya está registrado.' );
      return;
    }

    if ( this.errorAvailability[ 'identification' ] ) {
      Notification.danger( 'El número de identificación ya está registrado.' );
      return;
    }

    this.loading = true;
    this.api.register( {
      identification: Number.parseInt( this.form.get( 'identification' )?.value ),
      email: this.form.get( 'email' )?.value,
      id_type: this.form.get( 'id_type' )?.value,
      username: this.form.get( 'username' )?.value,
      name: this.form.get( 'name' )?.value,
      surname: this.form.get( 'surname' )?.value,
      password: this.form.get( 'password' )?.value,
    } ).subscribe( {
      next: (): void => {
        Notification.success( 'Tu cuenta ha sido creada exitósamente.' );
        this.router.navigate( [ '..' ] ).then();
      },
      error: err => {
        this.loading = true;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
