import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DecisionTreeService } from "../../../services/decision-tree.service";
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { LawModel } from "../../../model/law.model";
import { ArticleModel } from "../../../model/article.model";
import { AggravatingModel } from "../../../model/aggravating.model";
import { Notification } from "../../../include/notification";
import { Response } from "../../../model/response.model";
import { MESSAGE_ERROR } from "../../../../environments/messages";
import { AnswerModel } from "../../../model/answer.model";
import { SentenceModel } from "../../../model/sentence.model";
import { SentencesService } from "../../../services/sentences.service";

@Component( {
  selector: 'themis-add',
  standalone: true,
  imports: [
    FaIconComponent,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
} )
export class AddComponent implements OnInit {
  public loading: boolean = false;
  public rule: FormGroup;
  public sentences: SentenceModel[] = [];

  constructor( private api: DecisionTreeService,
               @Inject( MAT_DIALOG_DATA ) public data: { law: LawModel, articles: ArticleModel[], rules: AggravatingModel[] },
               private dialog: MatDialogRef<AddComponent>,
               private sentenceApi: SentencesService,
               private builder: FormBuilder ) {

    this.rule = this.builder.group( {
      question: [ { value: '', disabled: false }, [ Validators.required ] ],
      article: [ { value: '', disabled: false }, [ Validators.required ] ],
      answers: this.builder.array( [] )
    } );
  }

  ngOnInit(): void {
    this.getSentences();
  }

  get answers(): FormArray {
    return this.rule.controls[ 'answers' ] as FormArray;
  }

  public getSentences(): void {
    this.loading = true;
    this.sentenceApi.all().subscribe( {
      next: ( response: Response<SentenceModel[]> ): void => {
        this.loading = false;
        this.sentences = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  public add(): void {
    if ( this.rule.invalid ) {
      this.rule.markAllAsTouched();
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    this.loading = true;

    // first add question
    this.api.addRule( {
      question: this.rule.get( 'question' )?.value,
      article: Number.parseInt( this.rule.get( 'article' )?.value )
    } ).subscribe( {
      next: ( response: Response<AggravatingModel> ): void => {
        let ansrs: number = 0;

        // second add answers
        for ( let a of this.answers.controls ) {
          this.api.addAnswer( {
            description: a.get( 'description' )?.value,
            aggravating: response.result?.id!,
            next_aggravating: a.get( 'next_aggravating' )?.value === 'null' ? null : Number.parseInt( a.get( 'next_aggravating' )?.value )
          } ).subscribe( {
            next: ( response: Response<AnswerModel> ): void => {
              ansrs += 1;

              // add sentence
              if ( a.get( 'sentence' )?.value !== 'null' ) {
                this.api.linkSentence( response.result?.id!, Number.parseInt( a.get( 'sentence' )?.value ) ).subscribe( {
                  next: (): void => {
                    // ==>
                  },
                  error: err => {
                    Notification.danger( err.error.message || 'No se pudo asociar sentencia.' );
                  }
                } );
              }
            },
            error: err => {
              this.loading = false;
              Notification.danger( err.error.message || MESSAGE_ERROR );
            }
          } );
        }

        setTimeout( (): void => {
          if ( ansrs === this.answers.controls.length ) {
            Notification.success( 'Regla registrada exitosamente.' );
            this.dialog.close( true );
          } else {
            this.loading = false;
            this.dialog.close( true );
            Notification.warning( 'La regla fue registrada, pero no se pudo registrar las respuestas.' );
          }
        }, 1000 );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  public addAnswer(): void {
    this.answers.push( this.builder.group( {
      description: [ { value: '', disabled: false }, [ Validators.required ] ],
      next_aggravating: [ { value: '', disabled: false }, [ Validators.required ] ],
      sentence: [ { value: '', disabled: false }, [] ],
    } ) );
  }

  public removeAnswer( i: number ): void {
    this.answers.removeAt( i );
  }
}
