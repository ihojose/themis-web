import { Component } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import moment from "moment/moment";
import { APP_VERSION } from "../../../environments/constants";

@Component( {
  selector: 'themis-welcome',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
} )
export class WelcomeComponent {
  public currentYear: number = moment().year();
  protected readonly APP_VERSION: string = APP_VERSION;

  constructor( private icons: FaIconLibrary, private router: Router ) {
    this.icons.addIconPacks( fas );
  }

  public start(): void {
    this.router.navigate( [ '/expert/consult' ] ).then();
  }
}
