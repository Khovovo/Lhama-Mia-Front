import { SelectionModel } from '@angular/cdk/collections';
import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import {AfterViewInit} from '@angular/core';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAddItemcardapioComponent } from 'src/app/modal/modal-add-itemcardapio/modal-add-itemcardapio.component';
import { ModalEditCardapioComponent } from 'src/app/modal/modal-edit-cardapio/modal-edit-cardapio.component';


export interface cardapioData{
  idItem: number,
  categoria: number,
  statusItem: boolean,
  nomeItem: string,
  preco: number,
  descricao: string,
  descricaoStatus: string,
}

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.page.html',
  styleUrls: ['./cardapio.page.scss'],
})
export class CardapioPage implements OnInit {
  public listaCardapio;
  dataSource: MatTableDataSource<cardapioData>;
  columns = [
        {
          columnDef: 'categoria'
        },
        {
          columnDef: 'nomeItem'
        },
        {
          columnDef: 'preco'
        },
        {
          columnDef: 'descricao'
        },
        {
          columnDef: 'statusItem',
        },
        {
          columnDef: 'Deletar',
        }
      ];
      displayedColumns = this.columns.map(c => c.columnDef);
      
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
      clickedRows = new Set<cardapioData>();

  
  public nomeUsuario: string
  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController
    ) 
    {
   
    this.nomeUsuario=''
    this.CardapioGet();  
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('nome')
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
async botaoDeletar(row){
  await this.AlertConfirmDelete(row.idItem);
}
async openModal() {
  const modal = await this.modalCtrl.create({
    component: ModalAddItemcardapioComponent,
    cssClass: 'modal-nova-funcao',
    componentProps: {}
  });
  modal.present();
  const { data } = await modal.onWillDismiss();

  if (data) {
  }
  this.CardapioGet();
}

async editModal(row) {
  const modal = await this.modalCtrl.create({
    component: ModalEditCardapioComponent,
    cssClass: 'modal-edit-cardapio',
    componentProps: {
      dadositemrow: row

    }
  });
  modal.present();
  const { data } = await modal.onWillDismiss();

  if (data) {
    this.CardapioGet()
  }
  this.CardapioGet();
}
async status(e, id) {
  try {
    console.log(" Aqui tem"+e + " E aqui também tem" + id)
    await this.api.req('cardapio/atualiza-status/' + id + '/' + e.checked, [], 'patch', {}, false, false, false)
      .then(data => {
        if (data) {
          this.CardapioGet();
        }
      });
  } catch (err) {
    console.error("mensagem de erro: ", err)
    throw err;
  }
}
async AlertConfirmEditar(row) {
  const confirm = await this.alertCtrl.create({
    cssClass: 'alertTest',
    mode: "ios",
    header: 'Editar Item selecionado?',
    message: '',
    buttons: [
      {
        text: 'Não',
        handler: () => {
        }
      },
      {
        text: 'Sim',
        handler: () => {
            this.editModal(row)
        }
      }
    ]
  });

  confirm.present();
}


async cardapioDeletar(id: String)
{
  try {
    await this.api.req('cardapio/deletar/'+id, [], 'delete', null, false, false, false)
      .then(data => {
        this.alertMensagem('Deletar','OK','Item Deletado Com Sucesso.');
        this.CardapioGet();         
      });
  } catch (err) {
    if (err.error.message.includes('Foreign key constraint failed on the field')){
      this.alertMensagem('Deletar','OK','Não foi possível deletar o Item.\n   Esse Item está em uso');  
    }
    else{
    this.alertMensagem('Deletar','OK','Não foi possível deletar o Item.\n Erro:'+err.error.statusCode);}
  }
}
async AlertConfirmDelete(id: String) {
  const confirm = await this.alertCtrl.create({
    cssClass: 'alertTest',
    mode: "ios",
    header: 'Deletar',
    message: 'Tem certeza que deseja excluir o Item selecionada?',
    buttons: [
      {
        text: 'Não',
        handler: () => {
        }
      },
      {
        text: 'Sim',
        handler: () => {
            this.cardapioDeletar(id)
        }
      }
    ]
  });

  confirm.present();
}
async CardapioGet() {
  try {
    await this.api.req('cardapio', [], 'get', null, false, false, false)
      .then(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource)
      });
  } catch (err) {
    throw err;
  }
}
}
