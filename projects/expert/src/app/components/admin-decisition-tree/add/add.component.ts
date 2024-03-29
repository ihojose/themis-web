import { Component, Inject } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DecisionTreeService } from "../../../services/decision-tree.service";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { LawModel } from "../../../model/law.model";
import { ArticleModel } from "../../../model/article.model";
import { DatePipe } from "@angular/common";
import { AggravatingModel } from "../../../model/aggravating.model";

@Component( {
  selector: 'themis-add',
  standalone: true,
  imports: [
    FaIconComponent,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
} )
export class AddComponent {
  public loading: boolean = false;
  public rule: FormGroup;

  constructor( private api: DecisionTreeService,
               @Inject( DIALOG_DATA ) public data: { law: LawModel, articles: ArticleModel[], rules: AggravatingModel[] },
               private builder: FormBuilder ) {

    this.rule = this.builder.group( {
      question: [ { value: '', disabled: false }, [ Validators.required ] ],
      article: [ { value: '', disabled: false }, [ Validators.required ] ],
      answers: this.builder.array( [] )
    } );
  }

  public add(): void {

  }

  public addAnswer(): void {
    ( this.rule.get( 'answers' ) as FormArray ).push( this.builder.group( {
      description: [ { value: '', disabled: false }, [ Validators.required ] ],
      next_aggravating: [ { value: '', disabled: false }, [ Validators.required ] ],
    } ) );
  }

  public getAnswers(): FormArray {
    return this.rule.get( 'answers' ) as FormArray;
  }

  public removeAnswer( e: AbstractControl, i: number ): void {
    ( e as FormArray ).removeAt( i );
  }
}
