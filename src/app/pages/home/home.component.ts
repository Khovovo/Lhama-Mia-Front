import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public nomeUsuario: string
  constructor() {
    this.nomeUsuario='' 
  }

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('nome')
  }

}
