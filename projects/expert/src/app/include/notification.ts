import Swal from "sweetalert2";
import { environment } from "../../environments/environment.development";

export class Notification {
  private toast: typeof Swal;

  constructor() {
    this.toast = Swal.mixin( {
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: environment.notification.duration,
      timerProgressBar: true,
      didOpen: ( toast: HTMLElement ): void => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    } );
  }

  public static danger( message: string, opts: {} = {} ): void {
    new Notification().toast.fire( {
      icon: 'error',
      title: message
    } ).then( val => {
      // ...
    } );
  }

  public static warning( message: string, opts: {} = {} ): void {
    new Notification().toast.fire( {
      icon: 'warning',
      title: message
    } ).then( val => {
      // ..
    } );
  }
}
