import { Component } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component( {
  selector: 'themis-authentication',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
} )
export class AuthenticationComponent {

  public login: FormGroup;
  public loading: boolean = false;

  constructor( private builder: FormBuilder, private api: AuthService ) {
    this.login = this.builder.group( {
      username: [ { value: '', disabled: false }, [ Validators.required ] ],
      password: [ { value: '', disabled: false }, [ Validators.required ] ]
    } )
  }

  public auth(): void {
    if ( this.login.invalid ) {
      return
    }
  }
}
