import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { RestaurantePage } from '../../restaurante.page';

export interface pedidoData {
  quantidade: number,
  idItem: number,
  nome: String
}

export interface pedidoDataEnvio {
  quantidade: number,
  status: boolean,
  Colaborador: number,
  andamento: string,
  idComanda: number,
  dataPedido: Date,
  idItem: number,
}

@Component({
  selector: 'app-adicionar-pedido',
  templateUrl: './adicionar-pedido.component.html',
  styleUrls: ['./adicionar-pedido.component.scss'],
})
export class AdicionarPedidoComponent implements OnInit {

  @Output() idAtualiza = new EventEmitter<number>();

  celected = 0;
  mesaselecionada;
  idcolab: number;
  idcomanda;
  listaItems: pedidoData[] = [];
  dataSource: MatTableDataSource<pedidoData>;
  dataSourceDois: MatTableDataSource<pedidoData>;
  cardapioOriginal: any[] = []
  columns = [
    {
      columnDef: 'CodItem'
    },
    {
      columnDef: 'Nome'
    },
    {
      columnDef: 'Adicionar',
    }

  ];
  displayedColumns = this.columns.map(c => c.columnDef);

  columnsDois = [
    {
      columnDef: 'CodItem'
    },
    {
      columnDef: 'Nome'
    },
    {
      columnDef: 'QTD'
    },
    {
      columnDef: 'Adicionar',
    }

  ];
  displayedColumnsDois = this.columnsDois.map(c => c.columnDef);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clickedRows = new Set<pedidoData>();

  listaCategoria: any[] = []
  categoriaSelecionada: any

  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.cardapioGet();
    this.getCategoria();
  }



  filtrarCategoria() {
    if (this.categoriaSelecionada) {
      const cardapioFiltrado = this.cardapioOriginal.filter(item => item.categoria === this.categoriaSelecionada.idCategoria)
      this.dataSource = new MatTableDataSource(cardapioFiltrado);
      console.log('Possui filtro: ', this.categoriaSelecionada.idCategoria)
    } else {
      console.log('Nao Possui filtro: ', this.categoriaSelecionada)
      this.dataSource = new MatTableDataSource(this.cardapioOriginal);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('dataSource: ', this.dataSource.filteredData)
  }

  public adicionarItem(row) {
    console.log(row)
    console.log(row.idItem + "IDITEM")
    if (this.listaItems.some(x => x.idItem == row.idItem)) {
      this.listaItems.find(x => x.idItem == row.idItem).quantidade += 1;
    }
    else {
      let a: pedidoData = { quantidade: 1, idItem: row.idItem, nome: row.nomeItem };
      this.listaItems.push(a)
    }
    this.dataSourceDois = new MatTableDataSource(this.listaItems);
  }
  public modificarQuantidade(row, valor) {
    if (((this.listaItems.find(x => x.idItem == row.idItem).quantidade) + valor) == 0) {
      this.listaItems = this.listaItems.filter(x => x.idItem != row.idItem);
    }
    else {
      this.listaItems.find(x => x.idItem == row.idItem).quantidade += valor;
    }
    this.dataSourceDois = new MatTableDataSource(this.listaItems);
  }
  public limparLista() {
    this.listaItems = this.listaItems.filter(x => x.idItem == -5830);
    this.dataSourceDois = new MatTableDataSource(this.listaItems);

  }
  public definirComanda(num) {
    this.idcomanda = num;
  }
  public enviarLista() {
    if (this.listaItems.length == 0) {
      console.log("VAZIO ZÉ")
      this.avisoPedido("Não há nada selecionado, favor selecione itens antes de enviar o pedido.")

    }
    else {
      console.log("temcoisa")
      this.idcolab = Number(localStorage.getItem('idcol'))
      console.log(this.idcolab + "e " + this.idcomanda);
      let listatemporaria = [];
      let listaBonus = [];
      this.listaItems.forEach(element => {
        let objeto: pedidoDataEnvio = {
          quantidade: element.quantidade,
          status: true,
          Colaborador: this.idcolab,
          andamento: 'Solicitado',
          idComanda: this.idcomanda,
          dataPedido: new Date(),
          idItem: element.idItem

        };
        // this.funcPost(objeto)
        listatemporaria.push(objeto);
      });


      console.log(listatemporaria)
      this.funcPost(listatemporaria)
      console.log("está chegando sim")

    }
  }

  async funcPost(form) {
    try {
      await this.api.req('pedido', [], 'post', form, true, false, false)
        .then(async () => {
          await this.alertMensagem('Pedido Solicitado com sucesso!', 'Ok')
          this.limparLista();
          this.idAtualiza.emit(this.idcomanda);
        }).catch((err) => {
          this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na solicitação do pedido, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
          console.error("mensagem de erro: ", err)
        })
    } catch (err) {
      this.alertMensagem('Erro!', 'Ok', `Ocorreu algum erro na solicitação do pedido, tente novamente: <br><br> ${err.status} | ${err.statusText}`)
      console.error("mensagem de erro: ", err)
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

  async avisoPedido(menssagem) {
    const confirm = await this.alertCtrl.create({
      cssClass: 'alertTest',
      mode: "ios",
      header: 'Pedido',
      message: menssagem,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        },

      ]
    });
    confirm.present();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public async cardapioGet() {
    try {
      await this.api.req('cardapio', [], 'get', null, false, false, false)
        .then(data => {
          this.cardapioOriginal = data
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log("AQQQUIIII: ", this.dataSource.filteredData)
          console.log(this.dataSource)
          console.log(this.dataSource.filteredData)
        });
    } catch (err) {
      throw err;
    }

  }

  async getCategoria() {
    try {
      await this.api.req('categoria', [], 'get', null, false, false, false)
        .then(data => {
          this.listaCategoria = data
          console.log("listaCategoria: ", this.listaCategoria)
        });
    } catch (err) {
      throw err;
    }
  }
}