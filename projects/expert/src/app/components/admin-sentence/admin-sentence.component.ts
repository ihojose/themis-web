import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddComponent } from "./add/add.component";
import { SentencesService } from "../../services/sentences.service";

@Component( {
  selector: 'themis-admin-sentence',
  standalone: true,
  imports: [
    FaIconComponent,
    MatDialogModule
  ],
  templateUrl: './admin-sentence.component.html',
  styleUrl: './admin-sentence.component.scss'
} )
export class AdminSentenceComponent {

  constructor( private dialog: MatDialog,
               private api: SentencesService ) {
  }

  public openAdd(): void {
    this.dialog.open( AddComponent, {
      width: '700px',
      disableClose: false
    } ).afterClosed().subscribe( {
      next: value => {
        if ( !value ) {
          return
        }
      }
    } );
  }
}
