import { Component, OnInit } from '@angular/core';
import { SessionModel } from "../../model/session.model";
import { CommonModule } from "@angular/common";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { LocalStorageService } from "../../services/local-storage.service";
import { JwtModel } from "../../model/jwt.model";
import { Jwt } from "../../include/jwt";
import { SessionService } from "../../services/session.service";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { APP_NAME, MESSAGE_ERROR } from "../../../environments/messages";
import { HistoryService } from "../../services/history.service";
import { HistoryModel } from "../../model/history.model";

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
  public sessions: SessionModel[] = [];
  public historyList: HistoryModel[] = [];
  public activeSession?: number;
  public user?: JwtModel;
  public totalSessions: number = 0;
  public pluralSessions: { [ id: string ]: string } = {
    '=0': 'No hay sesiones',
    '=1': 'Una sesión',
    'other': '# sesiones'
  }
  public loading: { [ p: string ]: boolean } = {
    sessions: false,
    history: false
  };

  constructor( private icons: FaIconLibrary,
               private sessionApi: SessionService,
               private historyApi: HistoryService,
               private storage: LocalStorageService ) {
    this.icons.addIconPacks( fas );
  }

  ngOnInit(): void {

    // user session
    this.user = Jwt.user( this.storage );

    // load sessions
    this.getSessions();
  }

  public getHistory( session: number ): void {
    this.loading[ 'history' ] = true;

    this.historyApi.getSessionHistory( session ).subscribe( {
      next: ( response: Response<HistoryModel[]> ): void => {
        this.historyList = response.result!;
        this.loading[ 'history' ] = false;
      },
      error: err => {
        this.loading[ 'history' ] = false;
        Notification.warning( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  private getSessions(): void {
    this.loading[ 'sessions' ] = true;

    this.sessionApi.getSessions( Number.parseInt( this.user?.jti! ) ).subscribe( {
      next: ( response: Response<SessionModel[]> ): void => {
        this.sessions = response.result!;
        this.totalSessions = this.sessions.length;
        this.loading[ 'sessions' ] = false;
      },
      error: err => {
        this.loading[ 'sessions' ] = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  public selectSession( id: number ): void {
    this.activeSession = id;

    // load history
    this.getHistory( this.activeSession );
  }

  public deleteSession(): void {
    Notification.warning( 'Esta función aún no está disponible.' );
  }

  protected readonly APP_NAME = APP_NAME;
}
