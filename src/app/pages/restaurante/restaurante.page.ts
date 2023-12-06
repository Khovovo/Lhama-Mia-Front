import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { AdicionarPedidoComponent } from './components/adicionar-pedido/adicionar-pedido.component';
import { PagamentosComponent } from './components/pagamentos/pagamentos.component';

export interface comandaData {
  idComanda: number,
  idMesa: number,
  status: boolean,
  observacoes: String
}

export interface comandaCriarData {
  idMesa: number,
  status: boolean,
  observacoes: String
}

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.page.html',
  styleUrls: ['./restaurante.page.scss'],
})
export class RestaurantePage implements OnInit {
  selected = 0;
  mesaselecionada;
  public comandaMesa;
  mesaatual = 0;
  dataSource: MatTableDataSource<comandaData>;


  @ViewChild(AdicionarPedidoComponent) comandaPedido: AdicionarPedidoComponent;
  @ViewChild(PedidosComponent) comanda: PedidosComponent;
  @ViewChild(PagamentosComponent) pagamento: PagamentosComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController,
  ) { this.selected = 0
      console.log("OIIIII" + this.selected)
  }

  ngOnInit() {
    
    console.log('Mesa atual: ', this.mesaatual)
  }
  ngOnChanges(){
    this.selected = 3
      console.log("OIIIII" + this.selected)
  }

  mesaDeslecionada(idmesa) {
    console.log(idmesa)
    this.selected = idmesa.value;
    this.mesaatual = idmesa;
  }

  mesaSelecionada(idmesa: number) {
    this.mesaatual = idmesa
    this.ComandaMesaGet(idmesa);
  }
  atualizaPedidosFilho(idAtualiza: number) {
    console.log("CHEGOU AQYI ALÔ")
    this.comanda.pedidosMesaGet(this.comandaMesa);
    this.pagamento.pedidosMesaGet(this.comandaMesa);
  }
  obterComanda(idmesa) {
    if (this.dataSource.filteredData.length === 0) {
      this.AlertConfirmComanda(idmesa);
    } else {
      this.comandaMesa = this.dataSource.filteredData[0].idComanda;
      console.log(this.comandaMesa + "comanda Mesa")
      this.pagamento.pedidosMesaGet(this.comandaMesa);
      this.comanda.pedidosMesaGet(this.comandaMesa);
      this.comandaPedido.definirComanda(this.comandaMesa)
      this.selected = 1;
    }
  }
  
  async AlertConfirmComanda(idmesa) {
    const confirm = await this.alertCtrl.create({
      cssClass: 'alertTest',
      mode: "ios",
      header: 'Comanda',
      message: 'Essa mesa não possui comanda aberta, gostaria de abrir uma?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            let mesa: comandaCriarData = { idMesa: idmesa, status: true, observacoes: "" }
            this.funcPost(mesa);
          }
        }
      ]
    });
    confirm.present();
  }

  async AlertConfirmCriaComanda() {
    const confirm = await this.alertCtrl.create({
      cssClass: 'alertTest',
      mode: "ios",
      header: 'Comanda',
      message: 'Favor insira o nome do cliente',
      inputs: [
        {
          name: 'Nome',
          placeholder: 'Nome',
        }],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Concluir',
          handler: (data) => {
            console.log(data.Nome)
            this.selected = 1;
          }
        }
      ]
    });
    confirm.present();
  }

  async funcPost(form) {
    try {
      await this.api.req('comandaMesa', [], 'post', form, true, false, false)
        .then(async () => {
          await this.alertMensagem('Comanda criada com sucesso!', 'Ok')
          setTimeout(() => {
            this.ComandaMesaGet(this.mesaatual);
          }, 500);

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

  async ComandaMesaGetDois(id) {
    try {
      await this.api.req('comandaMesa/mesa/' + id, [], 'get', null, false, false, false)
        .then(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource)
          console.log(this.dataSource.filteredData)
        });
    } catch (err) {
      throw err;
    }
  }

  async ComandaMesaGet(id) {
    console.log()
    try {
      await this.api.req('comandaMesa/mesa/' + id, [], 'get', null, false, false, false)
        .then(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource)
          console.log('>>>>>>: ', this.dataSource.filteredData)
          this.obterComanda(id);
        });
    } catch (err) {
      throw err;
    }
  }
}
