import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LawModel } from "../../../model/law.model";
import { DatePipe } from "@angular/common";
import { ArticleService } from "../../../services/article.service";
import { Notification } from "../../../include/notification";
import { Response } from "../../../model/response.model";
import { ArticleModel } from "../../../model/article.model";
import { MESSAGE_ERROR } from "../../../../environments/messages";
import { createMask, InputMaskModule, InputmaskOptions } from "@ngneat/input-mask";

@Component( {
  selector: 'themis-add',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FaIconComponent,
    DatePipe,
    InputMaskModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
} )
export class AddComponent {
  public loading: boolean = false;
  public article: FormGroup;
  public laws: LawModel[] = [];
  public numberMask: InputmaskOptions<any> = createMask( { alias: 'numeric' } );

  constructor( private builder: FormBuilder,
               private api: ArticleService,
               private dialog: MatDialogRef<AddComponent>,
               @Inject( MAT_DIALOG_DATA ) private data: LawModel[] ) {
    this.laws = this.data;
    this.article = this.builder.group( {
      law: [ { value: undefined, disabled: false }, [ Validators.required ] ],
      number: [ { value: '', disabled: false }, [ Validators.required ] ],
      ordinal: [ { value: '', disabled: false }, [ Validators.required ] ],
      description: [ { value: '', disabled: false }, [ Validators.required ] ],
      min: [ { value: '', disabled: false }, [ Validators.required ] ],
      max: [ { value: '', disabled: false }, [ Validators.required ] ],
    } );
  }

  public add(): void {
    if ( this.article.invalid ) {
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    if ( Number.parseInt( this.article.get( 'min' )?.value ) > Number.parseInt( this.article.get( 'max' )?.value ) ) {
      Notification.danger( 'La sentencia máxima debe ser mayor a la sentencia mínima.' );
      return;
    }

    this.loading = true;
    this.api.add( {
      number: Number.parseInt( this.article.get( 'number' )?.value ),
      ordinal: Number.parseInt( this.article.get( 'ordinal' )?.value ),
      description: this.article.get( 'description' )?.value,
      min_months: Number.parseInt( this.article.get( 'min' )?.value ),
      max_months: Number.parseInt( this.article.get( 'max' )?.value ),
      law: Number.parseInt( this.article.get( 'law' )?.value )
    } ).subscribe( {
      next: ( response: Response<ArticleModel> ): void => {
        this.loading = false;
        Notification.success( 'Artículo agregado exitosamente.' );
        this.dialog.close( response.result?.law! );
      },
      error: err => {
        this.loading = false;
        Notification.danger( MESSAGE_ERROR );
      }
    } )
  }
}
