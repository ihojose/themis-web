import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component( {
  selector: 'themis-loading',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
} )
export class LoadingComponent {

}
