import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import { DateFilterFn } from '@angular/material/datepicker'
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular'
import { AlertService } from 'src/app/services/alert.service'
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-modal-edit-colab',
  templateUrl: './modal-edit-colab.component.html',
  styleUrls: ['./modal-edit-colab.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD-MM-YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY ',
        },
      },
    },
  ],
})
export class ModalEditColabComponent implements OnInit {
  colab

  submitted = false

  formColab: FormGroup
  myFilter: DateFilterFn<any>

  departamentos
  funcoes
  listaFuncao
  listaDptos
  admissao
  submited
  sMail
  sSenha

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private api: ApiService,
    private fb: FormBuilder,
    private alert: AlertService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {

    this.colab = this.navParams.get('colaborador')
    this.formColab = this.fb.group({
      NOME: [this.colab.NOME, [Validators.required, Validators.maxLength(80)]],
      EMAIL: [this.colab.EMAIL, [Validators.email, Validators.required]],
      SENHA: [this.geraSenhaAleatoria()],
    })
  }

  ngOnInit() { }

  dismiss(save) {
    if (save == 'save') {
      this.modalCtrl.dismiss(true)
    } else {
      this.modalCtrl.dismiss(false)
    }
  }

  async colabPost(form) {
    try {
      await this.api
        .req('colaboradores/atualiza/' + this.colab.IDCOL, [], 'patch', form, false, false, false)
        .then(data => {
          this.dismiss('save')
        })
        .catch(err => {
          console.error("mensagem de erro: ", err)
        })
    } catch (err) {
      console.error("mensagem de erro: ", err)
      throw err
    }
  }

  sub() {
    this.submitted = true

    if (this.formColab.valid) {
      this.colabPost(this.formColab.value)
    }
  }


  /**
   * @param lista Lista para ser Ordenada
   */
  ordenaLista(lista) {
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

  async exibirAlert(sTitulo: string, sSubTitulo: string, sMensagemBotao: string, sMensagem?: string) {
    const alert = await this.alertCtrl.create({
      header: sTitulo,
      subHeader: sSubTitulo,
      message: sMensagem,
      mode: "ios",
      buttons: [sMensagemBotao],
      cssClass: 'alert-mensagem',
    });
    alert.present();
  }
}
