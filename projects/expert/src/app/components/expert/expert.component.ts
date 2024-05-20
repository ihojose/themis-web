import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LocalStorageService } from "../../services/local-storage.service";
import { Router, RouterOutlet } from "@angular/router";
import { ContentUtil } from "../../include/content.util";
import { AUTH_KEY, EXPERT_ACTIVE, EXPERT_TOGGLE } from "../../../environments/constants";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { JwtModel } from "../../model/jwt.model";
import { Jwt } from "../../include/jwt";

@Component( {
  selector: 'themis-expert',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule
  ],
  templateUrl: './expert.component.html',
  styleUrl: './expert.component.scss'
} )
export class ExpertComponent implements OnInit {
  public user?: JwtModel;
  public menu: boolean = false;
  public isConsult?: boolean = false;
  public consultToggled: boolean = false;

  @ViewChild( 'toggleUser' ) toggleUser?: ElementRef;
  @ViewChild( 'menuElement' ) menuElement?: ElementRef;

  constructor( public storage: LocalStorageService,
               private router: Router,
               private renderer: Renderer2,
               private icons: FaIconLibrary ) {
    this.icons.addIconPacks( fas );

    this.menuRenderer();

    // detect view change
    this.router.events.subscribe( (): void => {
      this.isConsult = this.storage.get( EXPERT_ACTIVE );
    } );
  }

  ngOnInit(): void {
    this.checkSession();

    // user session
    this.user = Jwt.user( this.storage );

    console.log( this.user );
  }

  public toggleSessions(): void {
    this.storage.save( EXPERT_TOGGLE, !this.consultToggled );
    this.consultToggled = this.storage.get( EXPERT_TOGGLE )!;
  }

  public link( l: string[] ): void {
    this.router.navigate( l ).then();
  }

  public toggleMenu(): void {
    setTimeout( (): void => {
      this.menu = true;
    }, 100 );
  }

  private checkSession(): void {
    if ( ContentUtil.isEmpty( this.storage.get( AUTH_KEY ) ) ) {
      this.router.navigate( [ '/auth' ] ).then();
    }
  }

  public logout(): void {
    this.storage.delete( AUTH_KEY );

    this.router.navigate( [ '/auth' ] ).then();
  }

  private menuRenderer(): void {
    this.renderer.listen( 'window', 'click', ( e: Event ): void => {
      if ( e.target !== this.toggleUser!.nativeElement && e.target !== this.menuElement!.nativeElement ) {
        this.menu = false;
      }
    } );
  }

  @HostListener( 'click' )
  public listeningClick(): void {
    this.consultToggled = this.storage.get( EXPERT_TOGGLE )!;
  }
}
