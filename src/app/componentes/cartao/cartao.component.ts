import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPerfilComponent } from 'src/app/modal/modal-perfil/modal-perfil.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.scss'],
})
export class CartaoComponent implements OnInit {

  public bAcesso: boolean;
  public sIdColaborador: string
  public bPrimeiroAcesso: any

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private api: ApiService
  ) {
    this.bAcesso = false
    this.sIdColaborador = localStorage.getItem('idcol')
    this.bPrimeiroAcesso = 'false'
  }

  async ngOnInit() {
    try {
      await this.api.req('colaboradores/' + this.sIdColaborador, [], 'get', {}, false, false, false).then(data => {
      })
    } catch (err) {
      console.error('mensagem de erro: ', err)
      throw err
    }

    if (localStorage.getItem('acesso') === 'true') {
      this.bAcesso = true
    }
    console.log('2: ', this.bPrimeiroAcesso);
    if (this.bPrimeiroAcesso === true) {
      console.log('aqui');
      await this.exibirAlert("Atenção!", "Altere sua senha atual", "Por questão de segurança, recomendamos que altere sua senha atual")
    }
  }

  async abrirAlterarSenha() {
    const modal = await this.modalCtrl.create({
      component: ModalPerfilComponent,
      cssClass: 'modal-perfil',
    })
    modal.present()

    const { data } = await modal.onWillDismiss()

    if (data) {
    }
  }

  async exibirAlert(sTitulo: string, sSubTitulo: string, sMensagem?: string) {
    const alert = await this.alertCtrl.create({
      header: sTitulo,
      subHeader: sSubTitulo,
      message: sMensagem,
      mode: "ios",
      buttons: [
        {
          text: 'Entendido',
          cssClass: 'blue',
          handler: () => { this.abrirAlterarSenha() },
        }],
      cssClass: 'alert-mensagem',
    });
    alert.present();
  }
}
