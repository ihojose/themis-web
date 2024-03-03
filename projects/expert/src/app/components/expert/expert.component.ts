import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from "../../services/local-storage.service";
import { Router, RouterOutlet } from "@angular/router";
import { ContentUtil } from "../../include/content.util";
import { AUTH_KEY } from "../../../environments/constants";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

@Component( {
  selector: 'themis-expert',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule
  ],
  templateUrl: './expert.component.html',
  styleUrl: './expert.component.scss'
} )
export class ExpertComponent implements OnInit {

  public currentYear: number = moment().year();

  constructor( private storage: LocalStorageService, private router: Router, private icons: FaIconLibrary ) {
    this.icons.addIconPacks( fas );
  }

  ngOnInit(): void {
    this.checkSession();
  }

  private checkSession(): void {
    if ( ContentUtil.isEmpty( this.storage.get( AUTH_KEY ) ) ) {
      this.router.navigate( [ '/auth' ] ).then();
    }
  }

  public logout(): void {
    // ...
  }
}
