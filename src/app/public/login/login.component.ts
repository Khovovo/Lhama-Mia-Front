import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, NavParams } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

import { AES } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  show = false;

  loginForm: FormGroup;
  submitted = false;

  emailResult: any;
  conn = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private auth: AuthService,
    private alert: AlertService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() { }

  password() {
    this.show = !this.show;
  }

  resetPassword() {
    this.navCtrl.navigateForward('reset');
  }

  async loginSub() {
    if (navigator.onLine) {
      try {
        const loading = await this.loadingCtrl.create({
          message: 'Carregando...',
        });
        this.submitted = true;
        this.loginForm.get('senha').setValue(this.loginForm.get('senha').value.trim())
        if (this.loginForm.valid) {
          loading.present()
          await this.auth
            .login(this.loginForm.value)
            .then(() => {
              if (localStorage.getItem('primeiroAcesso') == 'true') {
                this.navCtrl.navigateForward('home');
              } else {
                this.navCtrl.navigateForward('home');
              }
              loading.dismiss();
            })
            .catch(() => {
              this.conn = false;
              loading.dismiss();
              this.exibirAlert("Atenção!", "Email e/ou senha incorreto(s).", "")
            });
        }
      } catch (error) {
        this.exibirAlert("Erro!", "Desculpe, encontramos um erro ao processar sua solicitação. Por favor, tente recarregar a página para ver se isso resolve o problema. Se o problema persistir, verifique sua conexão com a internet. Caso contrário, entre em contato com nosso suporte técnico para obter ajuda adicional", "")
      }
    }else{
      alert("Verifique sua conexão com a internet e tente novamente")
    }
  }

  async exibirAlert(sTitulo: string, sSubTitulo: string, sMensagem?: string) {
    const alert = await this.alertCtrl.create({
      header: sTitulo,
      subHeader: sSubTitulo,
      message: sMensagem,
      mode: "ios",
      buttons: ['Entendido'],
      cssClass: 'alert-mensagem',
    });
    alert.present();
  }
}
