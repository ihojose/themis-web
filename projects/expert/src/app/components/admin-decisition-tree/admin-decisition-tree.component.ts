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

@Component( {
  selector: 'themis-admin-decisition-tree',
  standalone: true,
  imports: [
    FaIconComponent,
    GojsAngularModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './admin-decisition-tree.component.html',
  styleUrl: './admin-decisition-tree.component.scss',
} )
export class AdminDecisitionTreeComponent implements AfterViewInit {
  public selectedLaw?: number;
  public laws: LawModel[] = [];
  public loading: boolean = false;
  public diagram?: go.Diagram;
  public articles: string[] = [];

  constructor( private lawApi: LawService ) {
  }

  ngAfterViewInit(): void {

    this.defineSelect();
    this.getLaws();
    this.initGraph();
  }

  public initGraph(): void {
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram( 'decision-tree', {
      // move or delete whole subtrees
      "draggingTool.dragsTree": true,
      "commandHandler.deletesTree": true,
      "textEditingTool.starting": go.TextEditingTool.DoubleClick,
      layout: $( go.TreeLayout, { layerSpacing: 100, setsPortSpot: false, setsChildPortSpot: false } ),
      "undoManager.isEnabled": true,
      "ModelChanged": ( e: any ): void => {     // just for demonstration purposes,
        if ( e.isTransactionFinished ) {  // show the model data in the page's TextArea

        }
      }
    } );

    this.diagram.nodeTemplate = $( go.Node, "Auto", new go.Binding( "deletable", "", node => !!node.findTreeParentNode() ).ofObject(),
      $( go.Shape, "RoundedRectangle", { fill: "hsl(262, 30%, 51%)", stroke: "white" }, new go.Binding( "fill", "isSelected", s => s ? go.Brush.darken( "hsl(262, 30%, 51%)" ) : "hsl(262, 30%, 51%)" ).ofObject() ),
      $( go.Panel, "Table", { margin: 6 },
        $( go.TextBlock,
          {
            row: 0,
            name: "title",
            stroke: "white",
            text: 'Artículo',
            // @ts-ignore
            textEditor: window.TextEditorSelectBox,
            font: "11pt sans-serif",
            margin: new go.Margin( 0, 0, 4, 0 ),
            editable: true,
            choices: [ 'Demo' ]
          },
          // new go.Binding( "text", "title" ).makeTwoWay(),
          new go.Binding( "choices" )
        ),
        $( go.TextBlock,
          {
            row: 1,
            name: "Description",
            stroke: "white",
            editable: true
          },
          new go.Binding( "text", "description" ).makeTwoWay()
        ),
      )
    );

    this.diagram.nodeTemplate.selectionAdornmentTemplate = $( go.Adornment, "Spot",
      $( go.Placeholder, { margin: 12 } ),
      $( "Button",
        $( go.Shape, { geometryString: "M12 0 L3 9 M2 10 L0 12", strokeWidth: 3 } ),
        {
          alignment: new go.Spot( 0, 0, -5, 15 ),
          click: ( e, button ) => e.diagram.commandHandler.editTextBlock(
            // @ts-ignore
            button.part!.adornedPart.findObject( "Title" ) )
        } ),
      $( "Button",
        $( go.Shape, { geometryString: "M12 0 L3 9 M2 10 L0 12", strokeWidth: 3 } ),
        {
          alignment: new go.Spot( 0, 0, -5, 40 ),
          click: ( e, button ) => e.diagram.commandHandler.editTextBlock(
            // @ts-ignore
            button.part!.adornedPart.findObject( "Description" ) )
        } ),
      $( "Button",
        // this button is only visible if there are any children
        new go.Binding( "visible", "adornedPart", node => !node.isTreeLeaf ).ofObject(),
        $( go.Shape, "MinusLine",
          { width: 12, height: 12, strokeWidth: 2 },
          new go.Binding( "figure", "adornedPart", node => node.isTreeExpanded ? "MinusLine" : "PlusLine" ).ofObject() ),
        {
          alignment: go.Spot.TopRight,
          click: ( e, button ) => {
            // expand or collapse the subtree of this node
            // @ts-ignore
            const node = button.part!.adornedPart;
            if ( !node.isTreeExpanded ) {
              e.diagram.commandHandler.expandTree( node );
            } else {
              e.diagram.commandHandler.collapseTree( node );
            }
          }
        } ),
      $( "Button",
        $( go.TextBlock, "+",
          { font: "bold 12pt sans-serif" } ),
        {
          alignment: go.Spot.BottomRight,
          click: ( e, button ) => {
            // @ts-ignore
            const node = button.part!.adornedPart;
            // make sure the tree is expanded first
            if ( !node.isTreeLeaf && !node.isTreeExpanded ) {
              e.diagram.commandHandler.expandTree( node );
              return;
            }
            // then can add new node data and new link data objects to the model
            e.diagram.model.commit( m => {
              // add a child node data to the model
              const nodedata = { title: "Arículo", description: "Agravante" };
              m.addNodeData( nodedata );
              // add a link data to the model
              // @ts-ignore
              const linkdata = { from: node.key, to: nodedata.key };
              // @ts-ignore
              m.addLinkData( linkdata );
              const newnode = e.diagram.findNodeForData( nodedata );
              if ( newnode ) newnode.location = node.location;
              setTimeout( () => {
                const newlink = e.diagram.findLinkForData( linkdata );
                if ( newlink ) { // @ts-ignore
                  e.diagram.commandHandler.editTextBlock( newlink.findObject( "Text" ) );
                }
              } );
              node.updateAdornments();
            } );
          }
        } ),
    );

    this.diagram.linkTemplate =
      $( go.Link,
        {
          selectable: false,
          // @ts-ignore
          click: ( e, link ) => e.diagram.commandHandler.editTextBlock( link.findObject( "Text" ) )
        },
        $( go.Shape, { stroke: "gray", strokeWidth: 2 } ),
        $(
          go.Panel, "Auto",
          $( go.Shape, "RoundedRectangle", { fill: "white", strokeWidth: 0 } ),
          $(
            go.TextBlock, "choice",
            { name: "Text", maxSize: new go.Size( 100, NaN ), stroke: "gray", textAlign: "center", editable: true },
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

  private getArticles(): void {
    this.loading = true;

  }

  public selectLaw(): void {
    console.log( this.selectedLaw );
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
}
