import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component( {
  selector: 'themis-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
} )
export class AdminComponent {
  public sidebar: { icon: IconProp, title: string, link: string[] }[];

  constructor( private icons: FaIconLibrary ) {
    this.icons.addIconPacks( fas );

    // sidebar
    this.sidebar = [ {
      title: 'Cuentas',
      icon: [ 'fas', 'address-book' ],
      link: [ '/expert/admin/accounts' ]
    }, {
      title: 'Roles',
      icon: [ 'fas', 'building-lock' ],
      link: [ '/expert/admin/roles' ]
    }, {
      title: 'Leyes',
      icon: [ 'fas', 'scale-balanced' ],
      link: [ '/expert/admin/laws' ]
    }, {
      title: 'Artículos',
      icon: [ 'fas', 'file-contract' ],
      link: [ '/expert/admin/law/article' ]
    }, {
      title: 'Sentencias',
      icon: [ 'fas', 'file-circle-check' ],
      link: [ '/expert/admin/sentence' ]
    }, {
      title: 'Árbol de desición',
      icon: [ 'fas', 'diagram-successor' ],
      link: [ '/expert/admin/tree' ]
    } ];
  }
}
