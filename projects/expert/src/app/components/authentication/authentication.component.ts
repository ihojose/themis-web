import { Component } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

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

  public form: FormGroup;

  constructor( private builder: FormBuilder ) {
    this.form = this.builder.group( {
      username: [ { value: '', disabled: false }, [ Validators.required ] ],
      password: [ { value: '', disabled: false }, [ Validators.required ] ]
    } )
  }
}
