import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { LawModel } from "../../../model/law.model";
import { ArticleModel } from "../../../model/article.model";
import { AggravatingModel } from "../../../model/aggravating.model";
import { DecisionTreeService } from "../../../services/decision-tree.service";
import { Notification } from "../../../include/notification";
import { Response } from "../../../model/response.model";
import { MESSAGE_ERROR } from "../../../../environments/messages";
import { SentencesService } from "../../../services/sentences.service";
import { SentenceModel } from "../../../model/sentence.model";
import { AnswerModel } from "../../../model/answer.model";

@Component( {
  selector: 'themis-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FaIconComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
} )
export class EditComponent {
  public loading: boolean = false;
  public rule: FormGroup;
  public answersToDelete: AnswerModel[] = [];

  constructor( @Inject( DIALOG_DATA ) public data: {
                 law: LawModel,
                 articles: ArticleModel[],
                 rules: AggravatingModel[],
                 rule: AggravatingModel,
                 sentences: SentenceModel[],
               },
               private dialog: MatDialogRef<EditComponent>,
               private sentenceApi: SentencesService,
               private builder: FormBuilder,
               private api: DecisionTreeService ) {

    this.rule = this.builder.group( {
      question: [ { value: this.data.rule.question, disabled: false }, [ Validators.required ] ],
      article: [ { value: this.data.rule.article, disabled: false }, [ Validators.required ] ],
      answers: this.builder.array( [] )
    } );

    // add answers
    for ( let a of this.data.rule.answers! ) {
      this.addAnswer( a.id?.toString(), a.description, a.next_aggravating?.toString(), a.has_sentence?.sentence! > 0 ? a.has_sentence?.sentence!.toString() : '' );
    }
  }

  get answers(): FormArray {
    return this.rule.get( 'answers' ) as FormArray;
  }

  public addDelete( i: number ): void {
    if ( i > 0 ) {
      for ( let ans of this.data.rule.answers! ) {
        if ( ans.id === i ) {
          this.answersToDelete.push( ans );
          break
        }
      }
    }
  }

  public addAnswer( id: string = '', description: string = '', next: string = '', sentence: string = '' ): void {
    this.answers.push( this.builder.group( {
      id: [ { value: id, disabled: false }, [] ],
      description: [ { value: description, disabled: false }, [ Validators.required ] ],
      next_aggravating: [ { value: next ? next : '', disabled: false }, [] ],
      sentence: [ { value: sentence ? sentence : '', disabled: false }, [] ],
      prev_sentence: [ { value: sentence ? sentence : '', disabled: false }, [] ],
    } ) );
  }

  public save(): void {
    if ( this.rule.invalid ) {
      this.rule.markAllAsTouched();
      Notification.danger( 'Todos los campos son requeridos.' );
      return;
    }

    this.loading = true;
    this.api.editRule( {
      id: this.data.rule.id!,
      article: Number.parseInt( this.rule.get( 'article' )?.value ),
      question: this.rule.get( 'question' )?.value
    } ).subscribe( {
      next: (): void => {

        // deleted answer list
        for ( let i of this.answersToDelete ) {

          // delete
          this.api.deleteAnswer( i.id! ).subscribe( {
            next: (): void => {
              // ==>
            },
            error: (): void => {
              Notification.danger( `La respuesta ${ i } no pudo eliminarse.` );
            }
          } );
        }

        // edit or create answer list
        for ( let ans of this.answers.controls ) {
          if ( ans.get( 'id' )?.value ) {
            this.api.editAnswer( {
              id: Number.parseInt( ans.get( 'id' )?.value ),
              description: ans.get( 'description' )?.value,
              aggravating: this.data.rule.id!,
              next_aggravating: ans.get( 'next_aggravating' )?.value ? Number.parseInt( ans.get( 'next_aggravating' )?.value ) : null,
            } ).subscribe( {
              next: (): void => {

                // edit, create or delete sentence association
                if ( !ans.get( 'prev_sentence' )?.value && ans.get( 'sentence' )?.value ) {
                  this.api.linkSentence( Number.parseInt( ans.get( 'id' )?.value ), Number.parseInt( ans.get( 'sentence' )?.value ) ).subscribe( {
                    next: (): void => {
                      // ==>
                    },
                    error: err => {
                      Notification.danger( err.error.message || MESSAGE_ERROR );
                    }
                  } );
                } else if ( ans.get( 'prev_sentence' )?.value && !ans.get( 'sentence' )?.value ) {
                  this.api.deleteLinkSentence( Number.parseInt( ans.get( 'id' )?.value ), Number.parseInt( ans.get( 'prev_sentence' )?.value ) ).subscribe( {
                    next: (): void => {
                      // ==>
                    },
                    error: err => {
                      Notification.danger( err.error.message || MESSAGE_ERROR );
                    }
                  } );
                } else if ( ans.get( 'prev_sentence' )?.value && ans.get( 'sentence' )?.value && ans.get( 'prev_sentence' )?.value !== ans.get( 'sentence' )?.value ) {

                  // delete exists link
                  this.api.deleteLinkSentence( Number.parseInt( ans.get( 'id' )?.value ), Number.parseInt( ans.get( 'prev_sentence' )?.value ) ).subscribe( {
                    next: (): void => {
                      // ==>
                    },
                    error: err => {
                      Notification.danger( err.error.message || MESSAGE_ERROR );
                    }
                  } );

                  // create new link
                  this.api.linkSentence( Number.parseInt( ans.get( 'id' )?.value ), Number.parseInt( ans.get( 'sentence' )?.value ) ).subscribe( {
                    next: (): void => {
                      // ==>
                    },
                    error: err => {
                      Notification.danger( err.error.message || MESSAGE_ERROR );
                    }
                  } );
                }
              },
              error: (): void => {
                Notification.danger( `La respuesta "${ ans.get( 'description' )?.value }" no pudo ser registrada.` );
              }
            } );
          } else {
            this.api.addAnswer( {
              description: ans.get( 'description' )?.value,
              aggravating: this.data.rule.id!,
              next_aggravating: ans.get( 'next_aggravating' )?.value ? Number.parseInt( ans.get( 'next_aggravating' )?.value ) : null
            } ).subscribe( {
              next: ( response: Response<AnswerModel> ): void => {

                // create sentence association
                if ( ans.get( 'sentence' )?.value ) {
                  this.api.linkSentence( response.result?.id!, Number.parseInt( ans.get( 'sentence' )?.value ) ).subscribe( {
                    next: (): void => {
                      // ==>
                    },
                    error: err => {
                      Notification.danger( err.error.message || MESSAGE_ERROR );
                    }
                  } );
                }
              },
              error: (): void => {
                Notification.danger( `La respuesta "${ ans.get( 'description' )?.value }" no pudo ser registrada.` );
              }
            } )
          }
        }

        setTimeout( (): void => {
          this.loading = false;
          Notification.success( 'Regla modificada exitosamente.' );
          this.dialog.close( true );
        }, 500 );
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  public removeAnswer( i: number, id: string ): void {
    this.addDelete( id ? Number.parseInt( id ) : 0 );
    this.answers.removeAt( i );
  }
}
