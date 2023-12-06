import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavParams, ModalController, NavController, AlertController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.scss'],
})
export class ModalPerfilComponent implements OnInit {

  private usuarioLogado = localStorage.getItem('email');
  public submitted = false;
  public formColab: FormGroup;

  confirm: FormGroup;
  sMail: string;
  sSenhaRec: string;
  sSenhaNov: string;
  sConfSenha: string;

  senhaDif: boolean;

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private api: ApiService,
    private alert: AlertService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController
  ) {

    this.confirm = this.formBuilder.group({
      email : new FormControl ({value: this.usuarioLogado, disabled: true}),
      senhaAnterior: new FormControl('', Validators.required),
      senhaNova: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmaSenha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }
  ngOnInit() { }

  dismiss(save) {
    if (save == 'save') {
      this.modalCtrl.dismiss(true);
    } else {
      this.modalCtrl.dismiss(false);
    }
  }

  confSenha() {
    this.sSenhaNov = this.confirm.get('senhaNova').value.trim();
    this.sConfSenha = this.confirm.get('confirmaSenha').value.trim();

    if (this.sSenhaNov == this.sConfSenha) {
      this.senhaDif = false;
    } else {
      this.senhaDif = true;
    }
  }

  async alterar() {
    let sMail = this.confirm.get('email').value;
    this.sSenhaRec = this.confirm.get('senhaAnterior').value.trim();
    this.sSenhaNov = this.confirm.get('senhaNova').value.trim();
    this.sConfSenha = this.confirm.get('confirmaSenha').value.trim();
    this.submitted = true;

    if (!this.senhaDif) {
      await this.api.req('logins/redefinirSenha/' + sMail + '/' + this.sSenhaRec + '/' + this.sSenhaNov, [], 'patch', {}, false, false, false)
        .then(async (result) => {
          this.exibirAlert("Senha alterada com sucesso!", "")
          this.dismiss(0);

          this.navCtrl.navigateBack('login')
        }).catch(err => {
          if (err.error.message){
            this.exibirAlert("Erro!",err.error.message)
          }
          else{
            this.exibirAlert("Erro!", `Desculpe, encontramos um erro ao processar sua solicitação. Por favor, tente recarregar a página para ver se isso resolve o problema. Se o problema persistir, verifique sua conexão com a internet e certifique-se de que todos os dados inseridos estejam corretos. Caso contrário, entre em contato com nosso suporte técnico para obter ajuda adicional`,)
          }
        });
    }
  }

  async exibirAlert(sTitulo: string, sSubTitulo: string, sMensagem?: string) {
    const alert = await this.alertCtrl.create({
      header: sTitulo,
      subHeader: sSubTitulo,
      message: sMensagem,
      mode: "ios",
      buttons: [ 'Entendido' ],
      cssClass: 'alert-mensagem',
    });
    alert.present();
  }
}

