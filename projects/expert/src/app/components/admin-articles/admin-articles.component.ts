import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LawService } from "../../services/law.service";
import { LawModel } from "../../model/law.model";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { ArticleService } from "../../services/article.service";
import { ArticleModel } from "../../model/article.model";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddComponent } from "./add/add.component";
import { EditComponent } from "./edit/edit.component";
import { Modal } from "../../include/modal";

@Component( {
  selector: 'themis-admin-articles',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './admin-articles.component.html',
  styleUrl: './admin-articles.component.scss'
} )
export class AdminArticlesComponent implements OnInit {
  public laws: LawModel[] = [];
  public articles: ArticleModel[] = [];
  public loading: boolean = false;
  public selectedLaw?: number;

  constructor( private law: LawService, private api: ArticleService, private dialog: MatDialog ) {
  }

  ngOnInit(): void {
    this.getLaws();
  }

  public openAdd(): void {
    this.dialog.open( AddComponent, {
      data: this.laws,
      width: '700px'
    } ).afterClosed().subscribe( ( response: any ): void => {
      if ( response ) {
        this.selectedLaw = response;
        this.getArticles();
      }
    } );
  }

  public openEdit( article: ArticleModel ): void {
    this.dialog.open( EditComponent, {
      data: article,
      width: '700px'
    } ).afterClosed().subscribe( ( response: any ): void => {
      if ( response ) {
        this.getArticles();
      }
    } );
  }

  public selectLaw(): void {
    this.getArticles();
  }

  private getArticles(): void {
    this.loading = true;
    this.api.getByLaw( this.selectedLaw! ).subscribe( {
      next: ( response: Response<ArticleModel[]> ): void => {
        this.loading = false;
        this.articles = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  private getLaws(): void {
    this.loading = true;

    this.law.getAll().subscribe( {
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

  public delete( article: ArticleModel ): void {
    Modal.question( {
      title: `¿Deseas eliminar el artículo ${ article.number }?`,
      confirmText: 'Eliminar',
      onConfirm: (): void => {
        Modal.loading().then();
        this.api.delete( article.id! ).subscribe( {
          next: (): void => {
            Notification.success( 'Artículo eliminado exitosamente.' );
            this.getArticles();
          },
          error: err => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } )
      }
    } ).then();
  }
}
