import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MESSAGE_ERROR } from "../../../environments/messages";
import { HistoryService } from "../../services/history.service";
import { HistoryModel } from "../../model/history.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NewComponent } from "./new/new.component";
import { ArticleService } from "../../services/article.service";
import { ArticleModel } from "../../model/article.model";
import { AggravatingModel } from "../../model/aggravating.model";
import { DecisionTreeService } from "../../services/decision-tree.service";
import { far } from "@fortawesome/free-regular-svg-icons";
import { AnswerModel } from "../../model/answer.model";
import { SentenceModel } from "../../model/sentence.model";
import { VerdictModel } from "../../model/verdict.model";
import { Modal } from "../../include/modal";
import { LawModel } from "../../model/law.model";
import { LawService } from "../../services/law.service";

@Component( {
  selector: 'themis-consult',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatDialogModule
  ],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.scss'
} )
export class ConsultComponent implements OnInit {
  public sessions: SessionModel[] = [];
  public historyList: HistoryModel[] = [];
  public activeSession?: SessionModel;
  public law?: LawModel;
  public user?: JwtModel;
  public totalSessions: number = 0;
  public currentQuestion?: AggravatingModel;
  public currentSentence?: SentenceModel;
  public currentVerdict?: VerdictModel;
  public toVerdict = {
    minInBail: 0,
    maxInBail: 0,
    hasBail: false,
    hasAggrement: false
  };
  public pluralSessions: { [ id: string ]: string } = {
    '=0': 'No hay sesiones',
    '=1': 'Una sesión',
    'other': '# sesiones'
  }
  public loading = {
    sessions: false,
    history: false,
    main: false,
    question: false,
    verdict: false,
    law: false,
    typing: false
  };
  @ViewChild( 'doingQuestion' ) private doingAsk?: ElementRef;

  constructor( private icons: FaIconLibrary,
               private sessionApi: SessionService,
               private historyApi: HistoryService,
               private articleApi: ArticleService,
               private dtApi: DecisionTreeService,
               private lawApi: LawService,
               private storage: LocalStorageService,
               private dialog: MatDialog ) {
    this.icons.addIconPacks( fas, far );
  }

  ngOnInit(): void {

    // user session
    this.user = Jwt.user( this.storage );

    // load sessions
    this.getSessions();
  }

  /**
   * Open New Session.
   */
  public openNew(): void {
    this.dialog.open( NewComponent, {
      width: '700px',
      disableClose: true,
      data: { user: this.user! }
    } ).afterClosed().subscribe( {
      next: ( response: { added: boolean, session: SessionModel, law: LawModel } ): void => {
        if ( response.added ) {
          this.law = response.law;
          this.getSessions();
          setTimeout( () => this.selectSession( response.session ), 500 );
        }
      }
    } );
  }

  /**
   * Send answer to expert
   * @param answer Answer data
   */
  public sendAnswer( answer: AnswerModel ): void {
    this.historyApi.add( {
      session: this.activeSession?.id!,
      answer: answer.id!
    } ).subscribe( {
      next: ( response: Response<HistoryModel> ): void => {
        console.log( response.result );
        this.historyList.push( response.result! );

        // get next rule if exists
        if ( answer.next_aggravating ) {
          this.loading.question = true;
          this.dtApi.getRule( answer.next_aggravating! ).subscribe( {
            next: ( response: Response<AggravatingModel> ): void => {
              setTimeout( (): void => {
                this.currentQuestion = response.result!;
                this.loading.question = false;
                this.toBottom();
              }, 500 );
            },
            error: err => {
              this.loading.question = false;
              Notification.danger( err.error.message || MESSAGE_ERROR );
            }
          } );
          return
        } else if ( answer.has_sentence ) { // get sentence if exists
          this.currentSentence = response.result?.sentence;
          this.toVerdict.hasBail = this.toVerdict.hasBail ? this.toVerdict.hasBail : this.currentSentence?.has_bail! > 0;
          this.toVerdict.hasAggrement = !this.toVerdict.hasAggrement ? this.toVerdict.hasAggrement : this.currentSentence?.has_agreement! > 0;

          // add verdict following veriables
          setTimeout( (): void => this.doVerdict(), 500 );
        }

        this.currentQuestion = undefined;
        this.toBottom();
      },
      error: err => {
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Add verdict to end the conversation
   * @private
   */
  private doVerdict(): void {
    this.loading.typing = true;
    this.dtApi.addVerdict( {
      session: this.activeSession?.id!,
      sentence: this.currentSentence?.id!,
      has_jail: this.toVerdict.hasBail ? 1 : 0,
      months: this.toVerdict.hasAggrement ? this.toVerdict.minInBail : this.toVerdict.maxInBail,
    } ).subscribe( {
      next: ( response: Response<VerdictModel> ): void => {
        this.loading.typing = false;
        this.currentVerdict = response.result!;
      },
      error: err => {
        this.loading.typing = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Get article item
   * @private
   */
  private getArticle(): void {
    this.articleApi.get( this.currentQuestion?.article! ).subscribe( {
      next: ( response: Response<ArticleModel> ): void => {
        this.toVerdict.minInBail = response.result?.min_months! > this.toVerdict.minInBail ? response.result?.min_months! : this.toVerdict.minInBail;
        this.toVerdict.maxInBail = response.result?.max_months! > this.toVerdict.maxInBail ? response.result?.max_months! : this.toVerdict.maxInBail;
      },
      error: err => {
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Get initial rule
   * @private
   */
  private getFirstRule(): void {
    this.loading.question = true;
    this.dtApi.getFirst( this.law?.id! ).subscribe( {
      next: ( response: Response<AggravatingModel> ): void => {
        this.loading.question = false;
        this.currentQuestion = response.result!;
        this.getArticle();
      },
      error: err => {
        this.loading.question = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Get session history
   * @param session ACtive session
   */
  public getHistory( session: number ): void {
    this.loading[ 'history' ] = true;

    this.historyApi.getBySession( session ).subscribe( {
      next: ( response: Response<HistoryModel[]> ): void => {
        this.historyList = response.result!;
        this.loading[ 'history' ] = false;

        // start decision tree if history is empty
        if ( this.historyList.length === 0 ) {
          this.getFirstRule();
          return
        }

        // check if session is ongoing
        const h: HistoryModel = response.result!.at( response.result!.length - 1 )!;

        // check if it has sentence
        if ( h.next! ) {
          this.dtApi.getRule( h.next! ).subscribe( {
            next: ( response: Response<AggravatingModel> ): void => {
              this.currentQuestion = response.result!;
              this.getArticle();
            },
            error: err => {
              Notification.danger( err.error.message || MESSAGE_ERROR );
            }
          } );
        } else if ( !h.next && h.sentence ) { // check of it has sentence
          this.currentSentence = h.sentence;
        }

        // go down
        this.toBottom();
      },
      error: err => {
        this.loading[ 'history' ] = false;
        Notification.warning( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Get user sessions
   * @private
   */
  private getSessions(): void {
    this.loading[ 'sessions' ] = true;

    this.sessionApi.all( Number.parseInt( this.user?.jti! ) ).subscribe( {
      next: ( response: Response<SessionModel[]> ): void => {
        this.sessions = response.result!;
        this.totalSessions = this.sessions.length;
        this.loading[ 'sessions' ] = false;
      },
      error: err => {
        this.loading[ 'sessions' ] = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  /**
   * Select session
   * @param s Session entity
   */
  public selectSession( s: SessionModel ): void {

    // check if already selected
    if ( s.id === this.activeSession?.id! ) {
      return;
    }

    // set session view
    this.currentQuestion = undefined;
    this.currentSentence = undefined;
    this.currentVerdict = undefined;
    this.activeSession = s;

    // add verdict
    if ( this.activeSession?.verdicts?.id ) {
      this.currentVerdict = this.activeSession.verdicts;
    }

    // get law
    this.loading.law = true;
    this.lawApi.get( this.activeSession.law ).subscribe( {
      next: ( response: Response<LawModel> ): void => {
        this.loading.law = false;
        this.law = response.result!;
      },
      error: err => {
        this.loading.law = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );

    // load history
    this.getHistory( this.activeSession.id! );
  }

  /**
   * Delete user session.
   * @param session Session Entity
   */
  public deleteSession( session: SessionModel ): void {
    Modal.question( {
      title: `¿Deseas eliminar la sesión ${ session.date! }?`,
      confirmText: 'Eliminar',
      onConfirm: (): void => {
        Modal.loading().then();
        this.sessionApi.delete( session.id! ).subscribe( {
          next: (): void => {
            if ( session.id === this.activeSession?.id ) {
              this.activeSession = undefined;
              this.currentQuestion = undefined;
              this.currentVerdict = undefined;
              this.law = undefined;
            }

            this.getSessions();
            Notification.success( 'Sesión eliminada.' );
          },
          error: err => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } );
      }
    } ).then();
  }

  /**
   * Go to bottom of the conversation.
   */
  public toBottom(): void {
    setTimeout( (): void => {
      this.doingAsk?.nativeElement.scrollIntoView( { behavior: 'smooth', block: 'center' } );
    }, 300 );
  }

  /**
   * Go to chat conversation item.
   * @param id
   */
  public toChatItem( id: number ): void {
    document.getElementById( `conv-${ id }` )!.scrollIntoView( { behavior: 'smooth', block: 'start' } );
  }
}
