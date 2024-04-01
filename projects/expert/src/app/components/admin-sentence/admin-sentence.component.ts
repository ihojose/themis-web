import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddComponent } from "./add/add.component";
import { SentencesService } from "../../services/sentences.service";
import { Response } from "../../model/response.model";
import { SentenceModel } from "../../model/sentence.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { MatMenuModule } from "@angular/material/menu";
import { Modal } from "../../include/modal";
import { EditComponent } from "./edit/edit.component";

@Component( {
  selector: 'themis-admin-sentence',
  standalone: true,
  imports: [
    FaIconComponent,
    MatDialogModule,
    MatMenuModule
  ],
  templateUrl: './admin-sentence.component.html',
  styleUrl: './admin-sentence.component.scss'
} )
export class AdminSentenceComponent implements OnInit {
  public loading: boolean = false;
  public sentences: SentenceModel[] = [];

  constructor( private dialog: MatDialog,
               private api: SentencesService ) {
  }

  ngOnInit(): void {

    this.getAll();
  }

  private getAll(): void {
    this.loading = true;
    this.api.all().subscribe( {
      next: ( response: Response<SentenceModel[]> ): void => {
        this.loading = false;
        this.sentences = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  public openAdd(): void {
    this.dialog.open( AddComponent, {
      width: '700px',
      disableClose: true
    } ).afterClosed().subscribe( {
      next: value => {
        if ( !value ) {
          return
        }

        this.getAll();
      }
    } );
  }

  public openEdit( i: SentenceModel ): void {
    this.dialog.open( EditComponent, {
      width: '700px',
      disableClose: true,
      data: i
    } ).afterClosed().subscribe( {
      next: value => {
        if ( !value ) {
          return
        }

        this.getAll();
      }
    } );
  }

  public delete( i: SentenceModel ): void {
    Modal.question( {
      title: `¿Deseas eliminar la sentencia ${ i.id }?`,
      text: `Sentencia: ${ i.description }`,
      confirmText: 'Eliminar',
      onConfirm: inputValue => {
        Modal.loading().then();
        this.api.delete( i.id! ).subscribe( {
          next: (): void => {
            Notification.success( 'Sentencia eliminada exitosamente.' );
            this.getAll();
          },
          error: err => {
            Notification.danger( err.error.message || MESSAGE_ERROR );
          }
        } );
      }
    } ).then();
  }
}
