import { Injectable } from '@angular/core'
import { LoadingController, NavController } from '@ionic/angular'
import { AlertService } from '../services/alert.service'
import { ApiService } from '../services/api.service'

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  departamentos
  funcoes
  listaFuncao
  listaDptos
  sMail
  sSenha

  constructor (
    private api: ApiService,
    private navCtrl: NavController,
    private alert: AlertService,
    private loadingCtrl: LoadingController,) {}

  funcaoGet () {
    try {
      this.api.req('funcoes', [], 'get', null, false, false, false).then(data => {
        this.funcoes = []
        this.funcoes = data
        this.listaFuncao = data
        this.ordenaLista(this.funcoes)
      })
    } catch (err) {
      throw err
    }
  }

  departamentosGet () {
    try {
      this.api.req('departamentos', [], 'get', null, false, false, false).then(data => {
        this.departamentos = []
        this.departamentos = data
        this.listaDptos = data
        this.ordenaLista(this.departamentos)
      })
    } catch (err) {
      throw err
    }
  }
  /**
   * @param lista Lista para ser Ordenada
   */
  ordenaLista (lista) {
    lista.sort((a, b) => {
      if (a.DESCRICAO < b.DESCRICAO) {
        return -1
      }
      if (a.DESCRICAO > b.DESCRICAO) {
        return 1
      }
    })
  }

  // Gera uma nova senha aleatória
  geraSenhaAleatoria() {
    let novasenha = Math.random().toString(36).slice(-10)

    for (let index = 0; index < novasenha.length; index++) {
      //Trecho para adicionar ao menos uma letra maiúscula
      if (novasenha[index].match(/[a-z]/i)) {
        novasenha = novasenha.charAt(index).toUpperCase() + novasenha.substring(index + 1)
        break
      }
    }
    return novasenha
  }

  /**
   *
   * @param form Formulario com o email preenchido
   * @param submitted = true
   */
  async enviarEmail(form, email, senha, submitted) {
    this.sMail = email;
    this.sSenha = senha;

    console.log("*******: ", this.sMail, "*******", this.sSenha)

    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
    });

    submitted = true;
    if (form.valid) {
      await loading.present();
      await this.api.req('colaboradores/mandarEmail/' + this.sMail + '/' + this.sSenha, [], 'patch', { EMAIL: this.sMail, SENHA: this.sSenha }, false, false, false)
        .then(async (result) => {
          try {
            loading.dismiss();
            await this.alert.openSnackBar('Sucesso! Email enviado ao colaborador!', 'custom-style-success');
            this.navCtrl.navigateForward('confirm');
          } catch (e) {
            console.error(e)
          }
        })
        .catch(err => {
          loading.dismiss();
          if (err.error.message)
            this.alert.openSnackBar(err.error.message, 'custom-style-denied');
          else
            this.alert.openSnackBar('Erro na resposta do servidor', 'custom-style-denied')
        });
    }
  }
}
