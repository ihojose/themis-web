import { Component, OnInit } from '@angular/core';
import { SessionModel } from "../../model/session.model";
import { CommonModule } from "@angular/common";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

@Component( {
  selector: 'themis-consult',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.scss'
} )
export class ConsultComponent implements OnInit {
  public sessions: SessionModel = [];
  public totalSessions: number = 0;
  public pluralSessions: { [ id: string ]: string } = {
    '=0': 'No hay sesiones',
    '=1': 'Una sesión',
    'other': '# sesiones'
  }

  constructor( private icons: FaIconLibrary ) {
    this.icons.addIconPacks( fas );
  }

  ngOnInit(): void {

  }
}
