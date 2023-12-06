import { ModalPerfilComponent } from './modal/modal-perfil/modal-perfil.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './public/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { ModalAddColaboradorComponent } from './modal/modal-add-colaborador/modal-add-colaborador.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RespostaGuard } from './guards/resposta.guard';
import { ModalEditColabComponent } from './modal/modal-edit-colab/modal-edit-colab.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HashLocationStrategy, JsonPipe, LocationStrategy, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CabecalhoComponent } from './componentes/cabecalho/cabecalho.component';
import { ColaboradoresPage } from './pages/colaboradores/colaboradores.page';
import { HomeComponent } from './pages/home/home.component';
import { CartaoComponent } from './componentes/cartao/cartao.component';
import { CardapioPage } from './pages/cardapio/cardapio.page';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { RestaurantePage } from './pages/restaurante/restaurante.page';
import { MesasComponent } from './pages/restaurante/components/mesas/mesas.component';
import { AdicionarPedidoComponent } from './pages/restaurante/components/adicionar-pedido/adicionar-pedido.component';
import { PagamentosComponent } from './pages/restaurante/components/pagamentos/pagamentos.component';
import { PedidosComponent } from './pages/restaurante/components/pedidos/pedidos.component';
import { CozinhaPage } from './pages/cozinha/cozinha.page';
import { RelatoriosPage } from './pages/relatorios/relatorios.page';
import { ModalAddItemcardapioComponent } from './modal/modal-add-itemcardapio/modal-add-itemcardapio.component';
import { ModalEditCardapioComponent } from './modal/modal-edit-cardapio/modal-edit-cardapio.component';


registerLocaleData(localePt, 'pt');

@NgModule({
  exports: [
    MatTooltipModule,
  ],
  declarations: [
    AppComponent,
    ColaboradoresPage,
    LoginComponent,
    ModalAddColaboradorComponent,
    ModalEditColabComponent,
    ModalPerfilComponent,
    CabecalhoComponent,
    HomeComponent,
    CartaoComponent,
    ColaboradoresPage,
    CardapioPage,
    RestaurantePage,
    MesasComponent,
    AdicionarPedidoComponent,
    PagamentosComponent,
    PedidosComponent,
    CozinhaPage,
    RelatoriosPage,
    ModalAddItemcardapioComponent,
    ModalEditCardapioComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule,
    DragDropModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatNativeDateModule,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt'},
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MatFormFieldModule,
    MatDatepickerModule,
    AuthService,
    AuthGuard,
    LoginGuard,
    RespostaGuard
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }

