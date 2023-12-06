import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

export interface funcao {
  IDFUNC: String,
  DESCRICAO: String,
  IDDEP: String
}

@Component({
  selector: 'app-modal-add-colaborador',
  templateUrl: './modal-add-colaborador.component.html',
  styleUrls: ['./modal-add-colaborador.component.scss'],
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



export class ModalAddColaboradorComponent {

  dataSource: MatTableDataSource<funcao>;

  sMail: string;
  sSenha: string;
  sNome: string;

  tipoMensagem = 'custom-style-denied';
  submitted = false;
  tipoDeEnvio = false;

  indexNovoCol: number = 0;

  allCol = [];

  nameCol = false;
  emailCol = false;

  public listaFuncao;
  public listaDptos;

  public data: Date;

  formColab: FormGroup;
  myFilter: DateFilterFn<any>;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private fb: FormBuilder,
    private alert: AlertService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.colaboradoresGet();
    this.formColab = this.fb.group({
      NOME: ['', [Validators.required, Validators.maxLength(80)]],
      EMAIL: ['', [Validators.email, Validators.required]],
      SENHA: [this.geraSenhaAleatoria()],
      ACESSOSISTEMA: false,
      CHEFIA: true,
      STATUS: true
    })
  }

  ngOnInit() {
  }

  /**
   * @param lista Lista para ser Ordenada
   */
  ordenaLista(lista) {
    lista.sort((a, b) => {
      if (a.DESCRICAO < b.DESCRICAO) {
        return -1;
      }
      if (a.DESCRICAO > b.DESCRICAO) {
        return 1;
      }
    });
  }

  dismiss(save) {
    if (save == 'save') {
      this.modalCtrl.dismiss(true);
      this.colaboradoresGet();
    } else {
      this.modalCtrl.dismiss(false);
    }
  }

  async colabPost(form) {
    try {
      await this.api.req('colaboradores', [], 'post', form, true, false, false)
        .then(async () => {
          await this.alertMensagem('Colaborador adicionado com sucesso!', 'Ok')
        }).catch((err) => {
          this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na criação do colaborador, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
          console.error("mensagem de erro: ", err)
        })
    } catch (err) {
      this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na criação do colaborador, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
      console.error("mensagem de erro: ", err)
      throw err;
    }
  }

  async sub() {
    try {
      this.submitted = true;
      this.nameCol = false;
      this.emailCol = false;

      if (this.formColab.valid) {
        this.allCol.forEach(e => {

          // Se nome e email ja foi cadastrado
          if (e.NOME === this.formColab.value.NOME &&
            e.EMAIL === this.formColab.value.EMAIL) {
            this.nameCol = true;
            this.emailCol = true;

            // Se email ja foi cadastrado
          } else if (e.EMAIL === this.formColab.value.EMAIL) {
            this.emailCol = true;

            // Se nome ja foi cadastrado
          } else if (e.NOME === this.formColab.value.NOME) {
            this.nameCol = true;
          }
        })

        if (!this.nameCol && !this.emailCol) {
          await this.colabPost(this.formColab.value)
          this.dismiss('save')
          await this.colaboradoresGet();
        } else if (this.nameCol && this.emailCol) {
          this.alertMensagem('Atenção!', 'Ok', `Já existe um Colaborador com esse Nome e Email.`)
        } else if (this.nameCol) {
          this.alertMensagem('Atenção!', 'Ok', `Já existe um Colaborador com esse Nome.`)
        }
        else if (this.emailCol) {
          this.alertMensagem('Atenção!', 'Ok', `Já existe um Colaborador com esse Email.`)
        }
      }
    } catch (error) {
      console.error("mensagem de erro: ", error)
    }
  }


  mensagemAlerta(mensagem: string, tipo: string) {
    this.alert.openSnackBar(mensagem, this.tipoMensagem);
  }

  async colaboradoresGet() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
    });
    try {
      loading.present()
      await this.api.req('colaboradores', [], 'get', null, false, false, false)
        .then(data => {
          this.allCol = data;

          data.forEach(e => {
            if (e.IDCOL > this.indexNovoCol) {
              this.indexNovoCol = (e.IDCOL + 1)
            }
          })
        });
        loading.dismiss();
      } catch (err) {
        loading.dismiss();
        this.alertMensagem('Erro!', 'Ok', `Ocorreu na atualização dos colaboradores, recarregue sua página: <br><br> ${err.status} | ${err.statusText} <br> ${err.error.message ? err.error.message : ''}`)
      throw err;
    }

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

  async alertMensagem(cabecalho: string, botao: string, mensagem?: string,) {
    const alert = await this.alertCtrl.create({
      header: cabecalho,
      message: mensagem,
      cssClass: 'alertTest',
      mode: "ios",
      buttons: [
        {
          text: botao,
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
}


