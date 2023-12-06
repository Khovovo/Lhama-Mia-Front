import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.scss'],
})
export class CabecalhoComponent implements OnInit {

  public bAcesso: boolean
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
  ) {
    this.bAcesso = false
  }

  ngOnInit() {
    if(localStorage.getItem('acesso')==='true'){
      this.bAcesso = true
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'alertTest',
      header: 'Deseja realmente sair ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'red',
          handler: () => { },
        },
        {
          text: 'Sair',
          cssClass: 'blue',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }
  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('acesso', '');
    localStorage.setItem('idcol', '');
    this.navCtrl.navigateBack('login');
  }
}
