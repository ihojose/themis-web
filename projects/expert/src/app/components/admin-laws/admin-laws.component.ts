import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LawService } from "../../services/law.service";
import { LawModel } from "../../model/law.model";
import { Response } from "../../model/response.model";
import { Notification } from "../../include/notification";
import { MESSAGE_ERROR } from "../../../environments/messages";
import { DatePipe } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";

@Component( {
  selector: 'themis-admin-laws',
  standalone: true,
  imports: [
    FaIconComponent,
    DatePipe,
    MatMenuModule
  ],
  templateUrl: './admin-laws.component.html',
  styleUrl: './admin-laws.component.scss'
} )
export class AdminLawsComponent implements OnInit {
  public loading: boolean = false;
  public laws: LawModel[] = [];

  constructor( private api: LawService ) {
  }

  ngOnInit(): void {

    this.getLaws();
  }

  private getLaws(): void {
    this.loading = true;
    this.api.getAll().subscribe( {
      next: ( response: Response<LawModel[]> ): void => {
        this.loading = false;
        this.laws = response.result!;
      },
      error: err => {
        this.loading = false;
        Notification.danger( err.error.message || MESSAGE_ERROR );
      }
    } );
  }
}
