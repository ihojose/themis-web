import { AfterViewInit, Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { GojsAngularModule } from "gojs-angular";
import * as go from "gojs";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LawModel } from "../../model/law.model";
import { LawService } from "../../services/law.service";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { ArticleService } from "../../services/article.service";
import { ArticleModel } from "../../model/article.model";
import { DecisionTreeService } from "../../services/decision-tree.service";
import { AggravatingModel } from "../../model/aggravating.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddComponent } from "./add/add.component";

@Component( {
  selector: 'themis-admin-decisition-tree',
  standalone: true,
  imports: [
    FaIconComponent,
    GojsAngularModule,
    DatePipe,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './admin-decisition-tree.component.html',
  styleUrl: './admin-decisition-tree.component.scss',
} )
export class AdminDecisitionTreeComponent implements AfterViewInit {
  public selectedLaw?: string;
  public law?: LawModel;
  public laws: LawModel[] = [];
  public loading: boolean = false;
  public diagram?: go.Diagram;
  public articles: { [ id: number ]: ArticleModel } = {};
  public rules: AggravatingModel[] = [];

  constructor( private lawApi: LawService,
               private api: DecisionTreeService,
               private articleApi: ArticleService,
               private dialog: MatDialog ) {
  }

  ngAfterViewInit(): void {

    this.defineSelect();
    this.getLaws();
    this.initGraph();
  }

  private getRules( id: number ): void {
    this.api.getByArticle( id ).subscribe( {
      next: ( response: Response<AggravatingModel[]> ): void => {
        this.addingGraphItemRules( response.result! );
        this.rules = this.rules.concat( response.result! );
      },
      error: err => {
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  private addingGraphItemRules( rules: AggravatingModel[] ): void {
    for ( let r of rules ) {
      this.diagram?.model.addNodeData( {
        key: r.id,
        title: `Regla ${ r.id }, Artículo ${ this.articles[ r.article ].number }`,
        description: r.question.replace( /(?![^\n]{1,32}$)([^\n]{1,32})\s/g, '$1\n' ),
      } );
    }
  }

  public openAdd(): void {
    this.dialog.open( AddComponent, {
      width: '800px',
      disableClose: true,
      data: {
        law: this.law,
        articles: Object.values( this.articles ),
        rules: this.rules
      }
    } ).afterClosed().subscribe( {
      next: ( value: any ): void => {

      }
    } );
  }

  private getLaws(): void {
    this.lawApi.getAll().subscribe( {
      next: ( response: Response<LawModel[]> ): void => {
        this.loading = false;
        this.laws = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } )
  }

  public graphUpdate( e: any ): void {
    if ( e.isTransactionFinished ) {
      console.log( e.model );
    }
  }

  private getArticles(): void {
    this.loading = true;
    this.articles = [];
    this.rules = [];

    this.articleApi.getByLaw( this.law?.id! ).subscribe( {
      next: ( response: Response<ArticleModel[]> ): void => {
        this.loading = false;

        for ( let i of response.result! ) {
          this.articles[ i.id! ] = i;
          this.getRules( i.id! );
        }
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }

  public selectLaw(): void {
    if ( this.selectedLaw === 'undefined' ) {
      this.diagram?.clear();
      return;
    }

    this.diagram?.clear();

    // parsing law
    this.law = JSON.parse( this.selectedLaw! ) as LawModel;

    // getting articles
    this.getArticles();
  }

  public defineSelect(): void {
    let customEditor = new go.HTMLInfo();

    let customSelectBox = document.createElement( "select" );

    customEditor.show = function ( textBlock, diagram, tool ) {
      if ( !( textBlock instanceof go.TextBlock ) ) return;

      // Populate the select box:
      customSelectBox.innerHTML = "";

      let list = textBlock.choices;
      // Perhaps give some default choices if textBlock.choices is null
      if ( list === null ) list = [ "Default A", "Default B", "Default C" ];
      let l = list.length;
      for ( let i = 0; i < l; i++ ) {
        let op = document.createElement( "option" );
        op.text = list[ i ];
        op.value = list[ i ];
        if ( list[ i ] === textBlock.text ) op.selected = true;
        customSelectBox.add( op, null );
      }

      customSelectBox.value = textBlock.text;

      customSelectBox.addEventListener( "keydown", ( e: KeyboardEvent ): undefined | boolean => {
        if ( e.isComposing ) return;
        let key = e.key;
        if ( key === "Enter" ) {
          // @ts-ignore
          tool.acceptText( go.TextEditingTool.Enter );
          return;
        } else if ( key === "Tab" ) {
          // @ts-ignore
          tool.acceptText( go.TextEditingTool.Tab );
          e.preventDefault();
          return false;
        } else if ( key === "Escape" ) {
          tool.doCancel();
          if ( tool.diagram ) tool.diagram.focus();
        }

        return false;
      }, false );

      let loc = textBlock.getDocumentPoint( go.Spot.TopLeft );
      let pos = diagram.transformDocToView( loc );
      customSelectBox.style.left = pos.x + "px";
      customSelectBox.style.top = pos.y + "px";
      customSelectBox.style.position = 'absolute';
      customSelectBox.style.zIndex = '100';

      if ( diagram.div !== null ) diagram.div.appendChild( customSelectBox );
      customSelectBox.focus();
    }

    customEditor.hide = function ( diagram, tool ) {
      diagram.div!.removeChild( customSelectBox );
    }

    customEditor.valueFunction = function () {
      return customSelectBox.value;
    }

    // @ts-ignore
    window.TextEditorSelectBox = customEditor;
  }

  public toJson( val: any ): string {
    return JSON.stringify( val );
  }

  public initGraph(): void {
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram( 'decision-tree', {
      // move or delete whole subtrees
      'initialContentAlignment': go.Spot.Left,
      'allowMove': false,
      "draggingTool.dragsTree": false,
      "commandHandler.deletesTree": false,
      'layout': $( go.TreeLayout, { layerSpacing: 100, setsPortSpot: false, setsChildPortSpot: false } ),
      "undoManager.isEnabled": true,
      "ModelChanged": ( e: any ): void => {
        this.graphUpdate( e );
      }
    } );

    this.diagram.nodeTemplate = $( go.Node, "Auto", new go.Binding( "deletable", "", node => !!node.findTreeParentNode() ).ofObject(),
      $( go.Shape, "RoundedRectangle", { fill: "hsl(262, 30%, 51%)", stroke: "hsl(262, 30%, 51%)" }, new go.Binding( "fill", "isSelected", s => s ? go.Brush.darken( "hsl(262, 30%, 51%)" ) : "hsl(262, 30%, 51%)" ).ofObject() ),
      $( go.Panel, "Table", { margin: 6 },
        $( go.TextBlock,
          {
            row: 0,
            name: "title",
            stroke: "white",
            text: '-',
            font: "11pt sans-serif",
            margin: new go.Margin( 0, 0, 4, 0 ),
            editable: false,
          },
          new go.Binding( "text", "title" ).makeTwoWay(),
        ),
        $( go.TextBlock,
          {
            row: 1,
            name: "Description",
            stroke: "white",
            editable: false
          },
          new go.Binding( "text", "description" ).makeTwoWay()
        ),
      )
    );

    this.diagram.nodeTemplate.selectionAdornmentTemplate = $( go.Adornment, "Spot" );

    this.diagram.linkTemplate =
      $( go.Link,
        {
          selectable: false,
          // @ts-ignore
          // click: ( e, link ) => e.diagram.commandHandler.editTextBlock( link.findObject( "Text" ) )
        },
        $( go.Shape, { stroke: "white", strokeWidth: 2 } ),
        $(
          go.Panel, "Auto",
          $( go.Shape, "RoundedRectangle", { fill: "white", strokeWidth: 0 } ),
          $(
            go.TextBlock, "respuesta",
            { name: "Text", maxSize: new go.Size( 100, NaN ), stroke: "black", textAlign: "center", editable: false },
            new go.Binding( "text" ).makeTwoWay()
          )
        )
      );

    this.diagram.model = new go.GraphLinksModel( [
      // { key: 1, title: "Decision 1", description: "Consider a, b, and c.\nDo you want to do X?", article: 1 },
      // { key: 2, title: "Decision 2", description: "Do you want to do Y?", article: 1 },
      // { key: 3, title: "Outcome 1", description: "The end", article: 1 },
      // { key: 4, title: "Outcome 1", description: "one solution", article: 1 },
      // { key: 5, title: "Outcome 2", description: "another solution", article: 1 },
    ], [
      // { from: 1, to: 2, text: "Yes" },
      // { from: 1, to: 3, text: "No" },
      // { from: 2, to: 4, text: "Yes" },
      // { from: 2, to: 5, text: "No" },
    ] );
  }
}
