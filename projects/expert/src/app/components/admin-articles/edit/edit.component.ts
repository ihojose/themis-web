import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatePipe } from "@angular/common";
import { createMask, InputMaskModule, InputmaskOptions } from "@ngneat/input-mask";
import { ArticleService } from "../../../services/article.service";
import { Notification } from "../../../include/notification";
import { Response } from "../../../model/response.model";
import { ArticleModel } from "../../../model/article.model";
import { MESSAGE_ERROR } from "../../../../environments/messages";

@Component( {
  selector: 'themis-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FaIconComponent,
    DatePipe,
    InputMaskModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
} )
export class EditComponent {
  public loading: boolean = false;
  public form: FormGroup;
  public numberMask: InputmaskOptions<any> = createMask( { alias: 'numeric' } );

  constructor( private builder: FormBuilder,
               private api: ArticleService,
               private dialog: MatDialogRef<EditComponent>,
               @Inject( MAT_DIALOG_DATA ) public data: ArticleModel ) {
    this.form = this.builder.group( {
      number: [ { value: this.data.number, disabled: false }, [ Validators.required ] ],
      ordinal: [ { value: this.data.ordinal, disabled: false }, [ Validators.required ] ],
      description: [ { value: this.data.description, disabled: false }, [ Validators.required ] ],
      min: [ { value: this.data.min_months, disabled: false }, [ Validators.required ] ],
      max: [ { value: this.data.max_months, disabled: false }, [ Validators.required ] ],
    } );
  }

  public edit(): void {
    // noinspection DuplicatedCode
    if ( this.form.invalid ) {
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    if ( Number.parseInt( this.form.get( 'min' )?.value ) > Number.parseInt( this.form.get( 'max' )?.value ) ) {
      Notification.danger( 'La sentencia máxima debe ser mayor a la sentencia mínima.' );
      return;
    }

    this.loading = true;
    this.api.edit( {
      id: this.data.id!,
      number: Number.parseInt( this.form.get( 'number' )?.value ),
      ordinal: Number.parseInt( this.form.get( 'ordinal' )?.value ),
      description: this.form.get( 'description' )?.value,
      min_months: Number.parseInt( this.form.get( 'min' )?.value ),
      max_months: Number.parseInt( this.form.get( 'max' )?.value ),
      law: this.data.law
    } ).subscribe( {
      next: ( response: Response<ArticleModel> ): void => {
        this.loading = false;
        Notification.success( 'Artículo modificado exitosamente.' );
        this.dialog.close( response.result?.law! );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }
}
