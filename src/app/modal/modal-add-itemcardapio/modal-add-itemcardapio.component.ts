import {  OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
@Component({
  selector: 'app-modal-add-itemcardapio',
  templateUrl: './modal-add-itemcardapio.component.html',
  styleUrls: ['./modal-add-itemcardapio.component.scss'],
})
export class ModalAddItemcardapioComponent implements OnInit {

  public departamentos = [];
    public listaCategorias;
    formColab: FormGroup;
    tipoMensagem = 'custom-style-denied';
    submitted = false;
    
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private api: ApiService,
    private fb: FormBuilder,
    private alert: AlertService,


  ) {
    this.formColab = this.fb.group({
      nomeItem:['', [Validators.required, Validators.maxLength(80)]],
      descricao: ['', [Validators.required, Validators.maxLength(80)]],
      categoria: [0, [Validators.required]],
      preco : [0, [Validators.required]],
      statusItem: [true]
    })
    
    this.categoriaGet();
    
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
      await this.api.req('cardapio', [], 'post', form, true, false, false)
        .then(async () => {
          await this.alertMensagem('Item adicionado com sucesso!', 'Ok')        
        }).catch((err) => {
          this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na criação do Item, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
          console.error("mensagem de erro: ", err)
        })
        // this.dismiss('0');
    } catch (err) {
      this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na criação do Item, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
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
          handler: data => {if (cabecalho == 'Item adicionado com sucesso!')
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
