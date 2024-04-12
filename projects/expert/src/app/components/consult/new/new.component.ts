import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LawService } from "../../../services/law.service";
import { SessionService } from "../../../services/session.service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { LawModel } from "../../../model/law.model";
import { Response } from "../../../model/response.model";
import { Notification } from "../../../include/notification";
import { MESSAGE_ERROR } from "../../../../environments/messages";
import { JwtModel } from "../../../model/jwt.model";
import { SessionModel } from "../../../model/session.model";

@Component( {
  selector: 'themis-new',
  standalone: true,
  imports: [
    MatDialogModule,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
} )
export class NewComponent implements OnInit {
  public loading: boolean = false;
  public form: FormGroup;
  public laws: { [ id: number ]: LawModel } = {};
  protected readonly Object = Object;

  constructor( @Inject( MAT_DIALOG_DATA ) public data: { user: JwtModel },
               private dialog: MatDialogRef<NewComponent>,
               private builder: FormBuilder,
               private lawApi: LawService,
               private sessionApi: SessionService ) {

    this.form = this.builder.group( {
      law: [ { value: '', disabled: false }, [ Validators.required ] ]
    } );
  }

  ngOnInit(): void {
    this.getLaws();
  }

  private getLaws(): void {
    this.loading = true;

    // noinspection DuplicatedCode
    this.lawApi.getAll().subscribe( {
      next: ( response: Response<LawModel[]> ): void => {
        this.loading = false;
        for ( let [ id, law ] of Object.entries( response.result! ) ) {
          this.laws[ Number.parseInt( id ) ] = law;
        }
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  public new(): void {
    if ( this.form.invalid ) {
      Notification.danger( 'Todos los campos son obligatorios.' );
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.sessionApi.add( {
      law: Number.parseInt( this.form.get( 'law' )?.value ),
      account: Number.parseInt( this.data.user.jti )!,
    } ).subscribe( {
      next: ( response: Response<SessionModel> ): void => {
        this.loading = false;
        this.dialog.close( {
          added: true,
          session: response.result!,
          law: Number.parseInt( this.form.get( 'law' )?.value )
        } );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
