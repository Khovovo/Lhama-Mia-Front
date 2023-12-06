import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { asString, generateCsv, mkConfig } from 'export-to-csv';
import { ApiService } from 'src/app/services/api.service';
import { Buffer } from "buffer";

export interface bonusData {
  idBonus: number
  diaReferencia: Date 
  porcentagem: number
  idPedido: number
  valor: number
  nome: string
  valoritem: number
  idcolaborador: string
}

export interface csv {
  porcentagem: number
  valor: number
  nome: string
  valorVenda: number
  idcolaborador: number
}

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss'],
})


export class RelatoriosPage implements OnInit {
  
  range = new FormGroup({
    start: new FormControl<Date | '01/01/1970'>(null),
    end: new FormControl<Date | '01/01/2070'>(null),
  });
  displayedColumns: string[] = ['idcolaborador','nome', 'valorBonus','valorTotal', 'porcentagem'];
  dataSource: MatTableDataSource<bonusData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nTotalConta: number = 0
  pedidosFeitos: any
  periodoSelecionado: any
  pedidosFeitosOriginal: any
  datainicio: string
  datafim: string
  dadoscsv: any[] = []
  public sInputFltrado: string
  public bBloquearFiltroStatus: boolean
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController,
    private router: Router

    ) {

      
    }

  ngAfterViewInit() {
  }
  ngOnInit(){
    this.pedidosMesaGet();
  }
  salvarCSV(){
    console.log(this.dadoscsv)
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const csv = generateCsv(csvConfig)(this.dadoscsv);
    const filename = `${csvConfig.filename}.csv`;
    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

    let myBlob = new Blob([csvBuffer], {type: "text/csv"});

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(myBlob);
    if ((this.range.value.start != null) && (this.range.value.end != null))
    {
      link.download = "Relacao : " + this.datainicio + " a " + this.datafim
    }
    else{
      link.download = "Relacao Todo Periodo"
    }
    link.click(); 

  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  definirPeriodo() {
    if ((this.range.value.start != null) && (this.range.value.end != null))
    {
    
    this.datafim = this.range.value.start.toLocaleString('en-US',{year: 'numeric', month: 'numeric', day: 'numeric'})
    this.datainicio = this.range.value.end.toLocaleString('en-US',{year: 'numeric', month: 'numeric', day: 'numeric'})
    this.datainicio = this.datainicio.replace("/","-")
    this.datainicio = this.datainicio.replace("/","-")
    this.datafim = this.datafim.replace('/','-')
    this.datafim = this.datafim.replace('/','-')
    console.log(this.datafim + " " + this.datainicio)
      console.log("tajoia")
      this.pedidosPorDataGet()
    }
  }
  public async pedidosMesaGet() {
    try {
      this.dadoscsv = []
      await this.api.req('bonusGarcom/gettudo', [], 'get', null, false, false, false)
        .then(async (data) => {
          console.log(data)
          this.pedidosFeitos = data
          // .filter(a => ((a.pedido.dataPedido >= this.range.value.start)  && (a.pedido.dataPedido <= this.range.value.end)) )
          this.pedidosFeitosOriginal = data.map(item => ({ ...item }))
          let dados: any[] = []
          for await (const ite of this.pedidosFeitos) {
            if (dados[0]) {
              let existe = dados.findIndex(item => item.pedido.colaborador.IDCOL === ite.pedido.colaborador.IDCOL)
              console.log(ite)
              if (existe !== null && existe !== -1) {
                // dados[existe].quantidade = dados[existe].quantidade + ite.quantidade
                
                dados[existe].valor = dados[existe].valor + ite.valor
                dados[existe].pedido.item.preco = dados[existe].pedido.item.preco + ite.pedido.item.preco
                dados[existe].nome = ite.pedido.colaborador.NOME
              } else {
                dados.push(ite)
              }
            } else {
              dados.push(ite)
            }
          }
          for await (const ite of dados) {
            let a: csv = {
              porcentagem: ite.porcentagem,  
              valor: ite.valor,
              nome: ite.nome,
              valorVenda: ite.pedido.item.preco,
              idcolaborador: ite.pedido.colaborador.IDCOL

            };
            console.log(a)
            console.log("eEEEESASEQSAE")
            this.dadoscsv.push(a);
          }
          this.dataSource = new MatTableDataSource(dados);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    } catch (err) {
      throw err;
    }
  }

  public async pedidosPorDataGet() {
    try {
      this.dadoscsv = []
      await this.api.req('bonusGarcom/gettudopordata/'+this.datainicio + "/"+this.datafim, [], 'get', null, false, false, false)
        .then(async (data) => {
          console.log(data)
          this.pedidosFeitos = data
          // .filter(a => ((a.pedido.dataPedido >= this.range.value.start)  && (a.pedido.dataPedido <= this.range.value.end)) )
          this.pedidosFeitosOriginal = data.map(item => ({ ...item }))
          let dados: any[] = []
          for await (const ite of this.pedidosFeitos) {
            if (dados[0]) {
              let existe = dados.findIndex(item => item.pedido.colaborador.IDCOL === ite.pedido.colaborador.IDCOL)
              console.log(ite)
              if (existe !== null && existe !== -1) {
                // dados[existe].quantidade = dados[existe].quantidade + ite.quantidade
                
                dados[existe].valor = dados[existe].valor + ite.valor
                dados[existe].pedido.item.preco = dados[existe].pedido.item.preco + ite.pedido.item.preco
                dados[existe].nome = ite.pedido.colaborador.NOME
              } else {
                dados.push(ite)
              }
            } else {
              dados.push(ite)
            }
            
          }
          for await (const ite of dados) {
            let a: csv = {
              porcentagem: ite.porcentagem,  
              valor: ite.valor,
              nome: ite.nome,
              valorVenda: ite.pedido.item.preco,
              idcolaborador: ite.pedido.colaborador.IDCOL

            };
            console.log(a)
            console.log("eEEEESASEQSAE")
            this.dadoscsv.push(a);
          }
          this.dataSource = new MatTableDataSource(dados);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    } catch (err) {
      throw err;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotal() {
    this.pedidosFeitosOriginal = this.pedidosFeitosOriginal.map(item => ({ ...item, total: (item.quantidade * item.item.preco) }))
    console.log('pedidosFeitosOriginal: ', this.pedidosFeitosOriginal)
    this.nTotalConta = this.pedidosFeitosOriginal.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }

}
