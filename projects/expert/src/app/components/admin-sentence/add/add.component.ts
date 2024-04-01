import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SentencesService } from "../../../services/sentences.service";
import { Notification } from "../../../include/notification";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { MESSAGE_ERROR } from "../../../../environments/messages";

@Component( {
  selector: 'themis-add',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
} )
export class AddComponent {
  public loading: boolean = false;
  public sentence: FormGroup;

  constructor( private builder: FormBuilder,
               private api: SentencesService,
               private dialog: MatDialogRef<AddComponent> ) {
    this.sentence = this.builder.group( {
      description: [ { value: '', disabled: false }, [ Validators.required ] ],
      has_bail: [ { value: '', disabled: false }, [ Validators.required ] ],
      has_aggrement: [ { value: '', disabled: false }, [ Validators.required ] ],
    } );
  }

  public save(): void {
    if ( this.sentence.invalid ) {
      this.sentence.markAllAsTouched();
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    this.loading = true;
    this.api.save( {
      description: this.sentence.get( 'description' )?.value,
      has_bail: Number.parseInt( this.sentence.get( 'has_bail' )?.value ) as 0 | 1,
      has_agreement: Number.parseInt( this.sentence.get( 'has_aggrement' )?.value ) as 0 | 1
    } ).subscribe( {
      next: (): void => {
        this.loading = false;
        Notification.success( 'Sentencia registrada exitosamente.' );
        this.dialog.close( true );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }
}
