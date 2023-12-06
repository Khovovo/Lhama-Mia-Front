import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

import { ModalAddColaboradorComponent } from '../../modal/modal-add-colaborador/modal-add-colaborador.component';

import { SelectionModel } from '@angular/cdk/collections';
import { ModalEditColabComponent } from 'src/app/modal/modal-edit-colab/modal-edit-colab.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { animate, state, style, transition, trigger } from '@angular/animations';


export interface ColaboradoresData {
  NOME: string;
  EMAIL: string;
  SUPERVISOR: string;
  ACESSOSISTEMA: boolean;
  CHEFIA: boolean;
  STATUS: boolean;
}

@Component({
  selector: 'app-colaboradores',
  templateUrl: 'colaboradores.page.html',
  styleUrls: ['colaboradores.page.scss'],
  animations: [
    trigger('encolherIcone', [
      state('inicio', style({ transform: 'scale(1)', top: "13px" })),
      state('final', style({ transform: 'scale(0.7)', top: "3px" })),
      transition('inicio<=>final', animate('500ms'))]),

    trigger('aumentarNome', [state('inicio', style({ transform: 'scale(0)' })),
    state('final', style({ transform: 'scale(1)' })),
    transition('inicio<=>final', animate('500ms'))])
  ]
})

export class ColaboradoresPage {

  displayedColumns: string[] = [
    'NOME',
    'EMAIL',
    'ACESSOSISTEMA',
    'CHEFIA',
    'STATUS'];

  dataSource: MatTableDataSource<ColaboradoresData>;
  selection = new SelectionModel<ColaboradoresData>(true, []);

  @ViewChild('paginatorFirst') paginator: MatPaginator;
  @ViewChild('sortFirst') sort: MatSort;
  @ViewChild('filtroStatus') filtroStatus: any;
  @ViewChild('input') input: ElementRef;


  @Output()
  change: EventEmitter<MatSlideToggleChange>

  selected = '';
  name = ''

  arrBack: any;
  colab = [];

  filterName = [];

  supervisorF = [];

  campoBusca = ''

  currencies = [
    { value: 'Todos', text: 'Todos' },
    { value: 'Ativ', text: 'Ativo' },
    { value: 'Inat', text: 'Inativo' },
  ];

  superior = [
  ]

  checked: boolean;

  departamentos
  funcoes
  listaFuncao
  listaDptos

  public sStatusFltrado: string
  public sInputFltrado: string
  public aListaStatusFiltrado: any[] = []
  public aFiltroInicial: any[] = []
  public bBloquearFiltroStatus: boolean
  public mouseNovoColaboradorPressionado: string = 'inicio';

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private alertCtrl: AlertController,
  ) {
    this.sStatusFltrado = ''
    this.bBloquearFiltroStatus = false
    const first: ColaboradoresData[] = [];
    this.dataSource = new MatTableDataSource(first);
    this.colaboradoresGet('inicial');
  }

  ngAfterViewInit() {
    this.gerarPaginacao()
  }

  passouMouseColaborador() {
    this.mouseNovoColaboradorPressionado = 'final';
  }

  tirouMouseColaborador() {
    this.mouseNovoColaboradorPressionado = 'inicio';
  }

  async acesso(e, id) {
    try {
      await this.api.req('colaboradores/atualiza-acesso/' + id + '/' + e.checked, [], 'patch', {}, false, false, false)
        .then(data => {
          if (data) {
            this.colaboradoresGet('atualizar');
          }
        });
    } catch (err) {
      throw err;
    }
  }

  async chefia(e, id) {
    try {
      await this.api.req('colaboradores/atualiza-chefia/' + id + '/' + e.checked, [], 'patch', {}, false, false, false)
        .then(data => {
          if (data) {
            this.colaboradoresGet('atualizar');
          }
        });
    } catch (err) {
      console.error("mensagem de erro: ", err)
      throw err;
    }
  }

  async status(e, id) {
    try {
      await this.api.req('colaboradores/atualiza-status/' + id + '/' + e.checked, [], 'patch', {}, false, false, false)
        .then(data => {
          if (data) {
            this.colaboradoresGet('atualizar');
          }
        });
    } catch (err) {
      console.error("mensagem de erro: ", err)
      throw err;
    }

    if (!e.checked) {
      this.chefia(e, id);
      this.acesso(e, id)
    }
  }


  async exibir(e) {
    this.input.nativeElement.value = ''
    this.aListaStatusFiltrado = [];
    let filtrar = this.colab;
    let filtroSelecionado = e.target.value

    if (this.sStatusFltrado) {
      filtroSelecionado = this.sStatusFltrado
    }

    if (filtrar) {
      if (filtroSelecionado == 'Ativ') {
        filtrar.forEach(d => {
          if (d.STATUS) {
            this.aListaStatusFiltrado.push(d)
          }
        })
      } else if (filtroSelecionado == 'Inat') {
        filtrar.forEach(d => {
          if (!d.STATUS) {
            this.aListaStatusFiltrado.push(d)
          }
        })
      } else {
        this.aListaStatusFiltrado = filtrar
      }
    }
    this.aFiltroInicial = this.aListaStatusFiltrado
    this.dataSource = new MatTableDataSource(this.aListaStatusFiltrado);
    this.sStatusFltrado = '';
    this.gerarPaginacao()
  }

  applyFilter(event: Event) {
    this.bBloquearFiltroStatus=true
    this.sInputFltrado = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.sInputFltrado.toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.gerarPaginacao()
    if(this.sInputFltrado.length<=0){
      this.bBloquearFiltroStatus=false
    }
  }

  gerarPaginacao() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAddColaboradorComponent,
      cssClass: 'modal-novo-colab',
      componentProps: {}
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.colaboradoresGet('atualizar');
    }
  }

  async colaboradoresGet(tipoFuncao: string) {
    try {
      await this.api.req('colaboradores', [], 'get', null, false, false, false)
        .then(async (data) => {
          this.input.nativeElement.value = ''
          this.aFiltroInicial = []
          this.colab = data;
          if (tipoFuncao === 'inicial') {
            data.forEach(e => {
              if (e.STATUS) {
                this.aFiltroInicial.push(e)
              }
            })
          } else {
            await this.executarFiltro()
          }


          let arr: ColaboradoresData[] = this.aFiltroInicial;

          if (arr.length > 0) {
            this.dataSource.data = arr;
            this.arrBack = this.dataSource;
          } else {
            this.dataSource.data = [];
          }
          this.gerarPaginacao()
        });
    } catch (err) {
      console.error("mensagem de erro: ", err)
      throw err;
    }

  }

  async edit(col) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alertTest',
      header: 'Editar esse colaborador ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'red',
          handler: () => { },
        },
        {
          text: 'Sim',
          cssClass: 'blue',
          handler: () => {
            this.editeColab(col)
          },
        },
      ],
    });

    await alert.present();
  }

  // Função é ativa quando o colaborador é Chefia e deseja remover.
  async editChefia(e, id) {
    if (!e.checked) {
      const alert = await this.alertCtrl.create({
        cssClass: 'alertTest',
        header: 'Deseja remover a Chefia?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'red',
            handler: () => {
              // Cancelar a ação do ToggleButton.
              this.colaboradoresGet('atualizar')
            }
          },
          {
            text: 'Sim',
            cssClass: 'blue',
            handler: () => {
              // Muda o Status da Chefia
              this.chefia(e, id) // CLIANDO NO SIM CHAMA A CHEFIA
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.chefia(e, id);
    }

  }

  // Metodo para voltar a posicao do SlideToggle
  onChange(ob: MatSlideToggleChange) {
    ob.source.checked = true;
    ob.checked = true;

    // let matSlideToggle: MatSlideToggle = ob.source;
  }

  async editeColab(col) {
    const modal = await this.modalCtrl.create({
      component: ModalEditColabComponent,
      cssClass: 'modal-edit-colab',
      componentProps: {
        colaborador: col
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.colaboradoresGet('atualizar');
    }
  }

  executarFiltro() {
    const FILTRO_STATUS = this.filtroStatus.nativeElement;
    this.sStatusFltrado = FILTRO_STATUS.value
    FILTRO_STATUS.dispatchEvent(new Event('change'));

    this.gerarPaginacao()
  }

  apagarTexto(){
    this.sInputFltrado = ''
    this.dataSource.filter = this.sInputFltrado.toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.gerarPaginacao()
    this.bBloquearFiltroStatus=false
  }
}
