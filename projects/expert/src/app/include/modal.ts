import Swal, { SweetAlertResult } from "sweetalert2";

export class Modal {
  private static preLoad: { [ id: string ]: any } = {
    showCancelButton: true,
    reverseButtons: true,
    showConfirmButton: true,
    allowOutsideClick: false,
    cancelButtonText: 'Cancelar',
  };

  public static question( opts: {
    title: string,
    text?: string,
    confirmText?: string,
    onConfirm?: ( inputValue: string ) => void
  } ): Promise<SweetAlertResult> {
    return Swal.fire( {
      ...this.preLoad,
      icon: 'question',
      title: opts.title,
      text: opts.text || '',
      confirmButtonText: opts.confirmText || 'Aceptar',
      preConfirm: opts.onConfirm
    } );
  }

  public static loading(): Promise<SweetAlertResult> {
    return Swal.fire( {
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: (): void => {
        Swal.showLoading();
      }
    } );
  }
}
