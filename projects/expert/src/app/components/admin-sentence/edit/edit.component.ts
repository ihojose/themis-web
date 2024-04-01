import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SentencesService } from "../../../services/sentences.service";
import { SentenceModel } from "../../../model/sentence.model";
import { Notification } from "../../../include/notification";
import { MESSAGE_ERROR } from "../../../../environments/messages";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component( {
  selector: 'themis-edit',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
} )
export class EditComponent {
  public loading: boolean = false;
  public sentence: FormGroup;

  constructor( private builder: FormBuilder,
               private api: SentencesService,
               private dialog: MatDialogRef<EditComponent>,
               @Inject( MAT_DIALOG_DATA ) public data: SentenceModel ) {
    this.sentence = this.builder.group( {
      description: [ { value: this.data.description, disabled: false }, [ Validators.required ] ],
      has_bail: [ { value: this.data.has_bail, disabled: false }, [ Validators.required ] ],
      has_aggrement: [ { value: this.data.has_agreement, disabled: false }, [ Validators.required ] ],
    } );
  }

  public save(): void {
    if ( this.sentence.invalid ) {
      this.sentence.markAllAsTouched();
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    this.loading = true;
    this.api.edit( {
      id: this.data.id,
      description: this.sentence.get( 'description' )?.value,
      has_bail: Number.parseInt( this.sentence.get( 'has_bail' )?.value ) as 0 | 1,
      has_agreement: Number.parseInt( this.sentence.get( 'has_aggrement' )?.value ) as 0 | 1
    } ).subscribe( {
      next: (): void => {
        this.loading = false;
        Notification.success( 'Sentencia modificada exitosamente.' );
        this.dialog.close( true );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }
}
