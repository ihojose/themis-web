import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LawService } from "../../services/law.service";
import { LawModel } from "../../model/law.model";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { DatePipe } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddComponent } from "./add/add.component";
import { ArticleService } from "../../services/article.service";
import { ArticleModel } from "../../model/article.model";
import { Modal } from "../../include/modal";

@Component( {
  selector: 'themis-admin-laws',
  standalone: true,
  imports: [
    FaIconComponent,
    DatePipe,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './admin-laws.component.html',
  styleUrl: './admin-laws.component.scss'
} )
export class AdminLawsComponent implements OnInit {
  public loading: boolean = false;
  public laws: LawModel[] = [];
  public articles: ArticleModel[] = [];

  constructor( private api: LawService, private dialog: MatDialog, private article: ArticleService ) {
  }

  ngOnInit(): void {

    this.getLaws();
  }

  private getLaws(): void {
    this.loading = true;
    this.api.getAll().subscribe( {
      next: ( response: Response<LawModel[]> ): void => {
        this.loading = false;
        this.laws = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  public openAdd(): void {
    this.dialog.open( AddComponent, {} ).afterClosed().subscribe( ( res ): void => {
      if ( res ) {
        this.getLaws();
      }
    } );
  }

  public getArticles( law: number ): void {
    this.article.getByLaw( law ).subscribe( {
      next: ( response: Response<ArticleModel[]> ): void => {
        this.articles = response.result!;
      },
      error: err => {
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  public delete( law: LawModel ): void {
    this.getArticles( law.id! );

    Modal.question( {
      title: `¿Deseas eliminar la ley ${ law.number } - ${ law.title }?`,
      confirmText: 'Eliminar',
      onConfirm: (): void => {
        if ( this.articles.length > 0 ) {
          Notification.warning( 'No se puede eliminar una ley que tiene artículos asociados.' );
          return;
        }

        Modal.loading().then();
        this.api.delete( law.number ).subscribe( {
          next: (): void => {
            Notification.success( 'Ley eliminada existosamente.' );
            this.getLaws();
          },
          error: err => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } );
      }
    } ).then();
  }
}
