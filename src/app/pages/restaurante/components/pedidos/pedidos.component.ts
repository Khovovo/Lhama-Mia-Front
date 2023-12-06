import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {ThemePalette} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';

export interface pedidoData{
  idPedido: number,
  quantidade: number,
  status: boolean,
  idItem: String
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  
  elected = 0;
  mesaselecionada;
  comandaMesa;
  dataSource: MatTableDataSource<pedidoData>;
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
      columnDef: 'Garçom',
    },
    {
      columnDef: 'Status',
    },
    {
      columnDef: 'Deletar',
    }
    
  ];
  displayedColumns = this.columns.map(c => c.columnDef);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clickedRows = new Set<pedidoData>();
  
  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController

  ) {    
   }

  ngOnInit() {
  }



  public async pedidosMesaGet(id) {
    this.mesaselecionada = id
    try {
      await this.api.req('pedido/comanda/'+id, [], 'get', null, false, false, false)
        .then(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource)
          console.log('>>>>>>>>>>',this.dataSource.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }

  async alterarStatus(id: number){
    let status = 'Entregue'
    console.log('Pasoiyu auqi')
    try {
      await this.api.req('pedido/atualizaAndamento/'+id+'/'+status, [], 'patch', null, false, false, false)
        .then(() => {
          this.pedidosMesaGet(this.mesaselecionada)
          console.log(this.dataSource)
          console.log(this.dataSource.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }
}
