import { SelectionModel } from '@angular/cdk/collections';
import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

export interface mesaData{
  idMesa?: number,
  numeroMesa?: number,
  statusMesa?: boolean,
}
@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss'],
})

export class MesasComponent implements OnInit {
  listaMesas: mesaData[] = [];
  @Output() idMesa = new EventEmitter<number>();
  // dataSource: MatTableDataSource<mesaData>;
  // columns = [
  //       {
  //         columnDef: 'categoria'
  //       },
  //       {
  //         columnDef: 'nomeItem'
  //       },
  //       {
  //         columnDef: 'preco'
  //       },
  //       {
  //         columnDef: 'descricao'
  //       },
  //       {
  //         columnDef: 'Deletar',
  //       }
  //     ];
  // displayedColumns = this.columns.map(c => c.columnDef);
      
      // @ViewChild(MatPaginator) paginator: MatPaginator;
      // @ViewChild(MatSort) sort: MatSort;
      // clickedRows = new Set<mesaData>();

  
  public nomeUsuario: string
  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private modalCtrl: ModalController
    ) 
    {
   
    this.nomeUsuario=''
    this.MesasGet(); 
  }

  ngOnInit() {}

  onClick(idMesa: number) {
    this.idMesa.emit(idMesa);
  }


  async MesasGet() {
    try {
      await this.api.req('mesa', [], 'get', null, false, false, false)
        .then(data => {
          // this.dataSource = new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.listaMesas = data;
          console.log(this.listaMesas)
        });
    } catch (err) {
      throw err;
    }
  }


}
