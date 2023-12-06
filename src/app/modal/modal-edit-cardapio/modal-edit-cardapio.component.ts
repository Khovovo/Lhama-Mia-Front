import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-edit-cardapio',
  templateUrl: './modal-edit-cardapio.component.html',
  styleUrls: ['./modal-edit-cardapio.component.scss'],
})
export class ModalEditCardapioComponent implements OnInit {
  public departamentos = [];
  public listaCategorias;
  public dadosItem;
  public id;

  formColab: FormGroup;
  tipoMensagem = 'custom-style-denied';
  submitted = false;
  
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private api: ApiService,
    private fb: FormBuilder,
    private alert: AlertService,
    public navParams: NavParams
  ) { 

    this.dadosItem = this.navParams.get('dadositemrow')
    this.categoriaGet();
    this.id = this.dadosItem.idItem;
    this.formColab = this.fb.group({
      nomeItem:[this.dadosItem.nomeItem, [Validators.required, Validators.maxLength(80)]],
      descricao: [this.dadosItem.descricao, [Validators.required, Validators.maxLength(80)]],
      categoria: [this.dadosItem.categoria, [Validators.required]],
      preco : [this.dadosItem.preco, [Validators.required]],
      statusItem: [this.dadosItem.statusItem]
    })
    
    
    
  }

  ngOnInit() {}
  

  async sub(){
    if (this.formColab.valid){
      this.formColab.value.categoria = parseInt(this.formColab.value.categoria);
    this.funcPost(this.formColab.value)}
  }

  async funcPost(form) {
    try {
      console.log(form)
      await this.api.req('cardapio/atualiza/'+this.id, [], 'patch', form, true, false, false)
        .then(async () => {
          await this.alertMensagem('Item alterado com sucesso!', 'Ok')        
        }).catch((err) => {
          this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na alteração do Item, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
          console.error("mensagem de erro: ", err)
        })
        // this.dismiss('0');
    } catch (err) {
      this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na alteração do Item, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
      console.error("mensagem de erro: ", err)
      throw err;
    }
  }



  async categoriaGet() {
    try {
      await this.api.req('categoria', [], 'get', ',', false, false, false)
        .then(data => {
          // Data Source
          this.listaCategorias = data;
          console.log(this.listaCategorias)
          this.ordenaLista(this.listaCategorias)
        });
    } catch (err) {
      throw err;
    }
  
  }
  mensagemAlerta(mensagem: string, tipo: string) {
    this.alert.openSnackBar(mensagem, this.tipoMensagem);
  }
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

  async alertMensagem(cabecalho: string, botao: string, mensagem?: string,) {
    const alert = await this.alertCtrl.create({
      header: cabecalho,
      message: mensagem,
      cssClass: 'alertTest',
      mode: "ios",
      buttons: [
        {
          text: botao,
          role: 'cancel',
          handler: data => {if (cabecalho == 'Item alterado com sucesso!')
          this.dismiss('0');}
        }
      ]
    });
    alert.present();
    
  }
  dismiss(save) {
    if (save == 'save') {
      this.modalCtrl.dismiss(true);
      // this.colaboradoresGet();
    } else {
      this.modalCtrl.dismiss(false);
    }
  }
  
}
