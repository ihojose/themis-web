import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { LawService } from "../../../services/law.service";
import { Response } from "../../../model/response.model";
import { LawModel } from "../../../model/law.model";
import { Notification } from "../../../include/notification";
import { MESSAGE_ERROR } from "../../../../environments/messages";
import { createMask, InputMaskModule, InputmaskOptions } from "@ngneat/input-mask";

@Component( {
  selector: 'themis-add',
  standalone: true,
  imports: [
    MatDialogModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
} )
export class AddComponent {
  public loading: boolean = false;
  public form: FormGroup;
  public dataMask: InputmaskOptions<any> = createMask( { mask: '9999-99-99', placeholder: 'YYYY-MM-DD' } );

  constructor( private icons: FaIconLibrary, private builder: FormBuilder, private api: LawService, private dialog: MatDialogRef<AddComponent> ) {
    this.icons.addIconPacks( fas );

    this.form = this.builder.group( {
      number: [ { value: '', disabled: false }, [ Validators.required ] ],
      title: [ { value: '', disabled: false }, [ Validators.required ] ],
      date: [ { value: '', disabled: false }, [ Validators.required ] ],
      description: [ { value: '', disabled: false }, [ Validators.required ] ],
    } );
  }

  public add(): void {
    if ( this.form.invalid ) {
      this.form.markAllAsTouched();
      return
    }

    this.loading = true;

    this.api.add( {
      number: this.form.get( 'number' )?.value,
      title: this.form.get( 'title' )?.value,
      description: this.form.get( 'description' )?.value,
      date: this.form.get( 'date' )?.value
    } ).subscribe( {
      next: ( response: Response<LawModel> ): void => {
        this.loading = false;
        Notification.success( `Ley ${ response.result?.title } agregada exitosamente.` );
        this.dialog.close( true );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
