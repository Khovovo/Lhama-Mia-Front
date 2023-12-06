import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private snackBar: MatSnackBar
  ) { }
  
  durationInSeconds = 4;

  openSnackBar(text: string, tipo:string) {
    this.snackBar.open(text, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: [tipo]
    });
  }

  public createAlert(titulo: string, corpo: string, icon: SweetAlertIcon) {
    const config: SweetAlertOptions = {
      title: titulo,
      html: corpo,
      icon,
      heightAuto: false
    };
    Swal.fire(config);
  }

  public createAlertConfirm(titulo: string, corpo: string): Promise<SweetAlertResult> {
    const config: SweetAlertOptions = {
      title: titulo,
      html: corpo,
      icon: "question",
      heightAuto: false,
      confirmButtonText: "Sim",
      showCancelButton: true,
      cancelButtonText: "Não",
      cancelButtonColor: '#EE2222',
      backdrop: false,
      allowOutsideClick: false
    };
    return Swal.fire(config);
  }
}
