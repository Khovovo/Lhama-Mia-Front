import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';


export interface comandaData {
    idPedido: number,
    quantidade: number,
    status: boolean,
    Colaborador: number,
    andamento: string,
    idComanda: number,
    dataPedido: Date,
    idItem: number,
}

@Component({
  selector: 'app-cozinha',
  templateUrl: './cozinha.page.html',
  styleUrls: ['./cozinha.page.scss'],
})
export class CozinhaPage implements OnInit {

  selected = 0;
  mesaselecionada;
  public comandaMesa;
  mesaatual = 0;
  dataSourceSolicitado: MatTableDataSource<comandaData>;
  dataSourceEmAndamento: MatTableDataSource<comandaData>;
  dataSourceProntos: MatTableDataSource<comandaData>;
  columns = [
    {
      columnDef: 'CodItem'
    },
    {
      columnDef: 'Nome'
    },
    {
      columnDef: 'QTD',
    },
    {
      columnDef: 'Aceitar',
    },
    {
      columnDef: 'Recusar',
    }
    
  ];
  displayedColumns = this.columns.map(c => c.columnDef);

  columns2 = [
    {
      columnDef: 'CodItem'
    },
    {
      columnDef: 'Nome'
    },
    {
      columnDef: 'QTD',
    },
    {
      columnDef: 'Finalizar',
    }
    
  ];
  displayedColumns2 = this.columns2.map(c => c.columnDef);

  columns3 = [
    {
      columnDef: 'CodItem'
    },
    {
      columnDef: 'Nome'
    },
    {
      columnDef: 'QTD',
    }
  ];
  displayedColumns3 = this.columns3.map(c => c.columnDef);


  @ViewChild('paginatorSolicitados') paginatorSolicitados: MatPaginator;
  @ViewChild('paginatorEmAndamento') paginatorEmAndamento: MatPaginator;
  @ViewChild('paginatorProntos') paginatorProntos: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController

  ) { 
    this.atualizaTabelas();
  }

  ngOnInit() {
  }
  async atualizaStatus(row,andamento: string){
    try {
      await this.api.req('pedido/atualizaAndamento/'+row.idPedido+'/'+andamento, [], 'patch', null, false, false, false)
        .then(() => {
          this.atualizaTabelas();
        });
    } catch (err) {
      throw err;
    }
  }
  atualizaTabelas(){
    this.pedidoGetEmAndamento();
    this.pedidoGetSolicitado();
    this.pedidoGetProntos();
  }
  async recusarPedido(row){

    this.AlertConfirmCancelar(row.idPedido)
    

  }

  async AlertConfirmCancelar(idPedido) {
    const confirm = await this.alertCtrl.create({
      cssClass: 'alertTest',
      mode: "ios",
      header: 'Pedido',
      message: 'Qual o motivo da recusa?',
      inputs: [
        {
          label: 'Solitação incorreta',
          type: 'radio',
          value: '1',
        },
        {
          label: 'Ingredientes Insuficientes',
          type: 'radio',
          value: '2',
        },
        {
          label: 'Outros',
          type: 'radio',
          value: '3',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: (values) => {
            console.log(values + " CANCELADO");
          }
        },
        {
          text: 'OK',
          handler: (values) => {
            console.log(values);
            try {
               this.api.req('pedido/cancela/'+idPedido, [], 'patch', null, false, false, false)
                .then(() => {
                  this.atualizaTabelas();
                });
            } catch (err) {
              throw err;
            }
          }
        },
        
      ]
    });
    confirm.present();
  }
  
  async pedidoGetSolicitado() {
    console.log()
    try {
      await this.api.req('pedido/geral/Solicitado'  , [], 'get', null, false, false, false)
        .then(data => {
          this.dataSourceSolicitado = new MatTableDataSource(data);
          this.dataSourceSolicitado.paginator = this.paginatorSolicitados;
          this.dataSourceSolicitado.sort = this.sort;
          console.log(this.dataSourceSolicitado)
          console.log('>>>>>>: ', this.dataSourceSolicitado.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }
  async pedidoGetEmAndamento() {
    console.log()
    try {
      await this.api.req('pedido/geral/Em Andamento'  , [], 'get', null, false, false, false)
        .then(data => {
          this.dataSourceEmAndamento = new MatTableDataSource(data);
          this.dataSourceEmAndamento.paginator = this.paginatorEmAndamento;
          this.dataSourceEmAndamento.sort = this.sort;
          console.log(this.dataSourceEmAndamento)
          console.log('>>>>>>: ', this.dataSourceEmAndamento.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }
  async pedidoGetProntos() {
    console.log()
    try {
      await this.api.req('pedido/geral/Prontos'  , [], 'get', null, false, false, false)
        .then(data => {
          this.dataSourceProntos = new MatTableDataSource(data);
          this.dataSourceProntos.paginator = this.paginatorProntos;
          this.dataSourceProntos.sort = this.sort;
          console.log(this.dataSourceProntos)
          console.log('>>>>>>: ', this.dataSourceProntos.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }
}
