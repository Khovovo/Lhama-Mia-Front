import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pedidoData } from '../pedidos/pedidos.component';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';


export interface bonusCriar {
  diaReferencia: Date
  porcentagem: number
  idPedido: number
  valor: number
}

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss'],
})
export class PagamentosComponent implements OnInit {

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
      columnDef: 'Preco',
    },
    {
      columnDef: 'Total',
    }

  ];
  displayedColumns = this.columns.map(c => c.columnDef);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clickedRows = new Set<pedidoData>();

  nTotalConta: number = 0
  pedidosFeitos: any
  pedidosFeitosOriginal: any

  bFinalizado = false

  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController,
    private router: Router

  ) {
  }

  ngOnInit() {
    console.log('Estou aqui')
  }

  getTotal() {
    this.pedidosFeitosOriginal = this.pedidosFeitosOriginal.map(item => ({ ...item, total: (item.quantidade * item.item.preco) }))
    console.log('pedidosFeitosOriginal: ', this.pedidosFeitosOriginal)
    this.nTotalConta = this.pedidosFeitosOriginal.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }


  public async pedidosMesaGet(id) {
    try {
      await this.api.req('pedido/pagemento/' + id, [], 'get', null, false, false, false)
        .then(async (data) => {
          this.pedidosFeitos = data
          this.pedidosFeitosOriginal = data.map(item => ({ ...item }))
          let dados: any[] = []
          for await (const ite of this.pedidosFeitos) {
            if (dados[0]) {
              let existe = dados.findIndex(item => item.idItem === ite.idItem)
              console.log(ite)
              if (existe !== null && existe !== -1) {
                dados[existe].quantidade = dados[existe].quantidade + ite.quantidade
                dados[existe].item.valor = dados[existe].item.valor + ite.item.valor
              } else {
                dados.push(ite)
              }
            } else {
              dados.push(ite)
            }
          }
          this.dataSource = new MatTableDataSource(dados);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.getTotal()
          console.log(this.dataSource)
          console.log(this.dataSource.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }

  async finalizar() {
    try {
      await this.api.req('comandaMesa/finalizar/' + this.pedidosFeitos[0].idComanda, [], 'patch', null, false, false, false)
        .then(data => {
          this.bFinalizado = true
          this.alertMensagem('Sucesso!', 'Confirmar', 'Mesa finalizada')
        });
      let dados: any[] = []
      for await (const ite of this.pedidosFeitos) {
        let a: bonusCriar = {
          diaReferencia: new Date(),
          idPedido: ite.idPedido,
          porcentagem: 1,
          valor: (ite.quantidade * ite.item.preco)*0.01
        }
        dados.push(a)

      }
      await this.api.req('bonusGarcom' , [], 'post', dados, null, false, false, false)
        .then(data => {
          this.bFinalizado = true
        });

    } catch (err) {
      throw err;
    }


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
          handler: data => { }
        }
      ]
    });
    alert.present();

  }


}
