import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { LawModel } from "../../../model/law.model";
import { ArticleModel } from "../../../model/article.model";
import { AggravatingModel } from "../../../model/aggravating.model";
import { DecisionTreeService } from "../../../services/decision-tree.service";

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

  constructor( @Inject( DIALOG_DATA ) public data: { law: LawModel, articles: ArticleModel[], rules: AggravatingModel[], rule: AggravatingModel },
               private dialog: MatDialogRef<EditComponent>,
               private builder: FormBuilder,
               private api: DecisionTreeService ) {

    this.rule = this.builder.group( {} );
  }
}
