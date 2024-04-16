import { Component, OnInit } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { HttpResponse } from "@angular/common/http";
import { TokenModel } from "../../model/auth.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { LocalStorageService } from "../../services/local-storage.service";
import { AUTH_KEY } from "../../../environments/constants";
import { ContentUtil } from "../../include/content.util";
import { Router, RouterLink } from "@angular/router";

@Component( {
  selector: 'themis-authentication',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
} )
export class AuthenticationComponent implements OnInit {

  public login: FormGroup;
  public loading: boolean = false;

  constructor( private builder: FormBuilder, private api: AuthService, private icons: FaIconLibrary, private storage: LocalStorageService, private router: Router ) {
    this.icons.addIconPacks( fas );

    this.login = this.builder.group( {
      username: [ { value: '', disabled: false }, [ Validators.required ] ],
      password: [ { value: '', disabled: false }, [ Validators.required ] ]
    } )
  }

  ngOnInit(): void {

    // checking session
    if ( !ContentUtil.isEmpty( this.storage.get( AUTH_KEY ) ) ) {
      this.router.navigate( [ '/expert' ] ).then();
    }
  }

  public auth(): void {
    if ( this.login.invalid ) {
      return
    }

    this.loading = true;

    this.api.auth( {
      username: this.login.get( 'username' )?.value,
      password: this.login.get( 'password' )?.value
    } )?.subscribe( {
      next: ( res: HttpResponse<TokenModel> ): void => {
        if ( ContentUtil.isEmpty( res.body?.result.token! ) ) {
          Notification.danger( 'No se encuentra el token.' );
          return
        }

        this.storage.save( AUTH_KEY, res.body?.result.token! );
        this.router.navigate( [ '/expert' ] ).then();
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
