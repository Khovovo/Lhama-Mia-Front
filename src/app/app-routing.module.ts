import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { RespostaGuard } from './guards/resposta.guard';
import { ColaboradoresPage } from './pages/colaboradores/colaboradores.page';
import { HomeComponent } from './pages/home/home.component';
import { CardapioPage } from './pages/cardapio/cardapio.page';
import { RestaurantePage } from './pages/restaurante/restaurante.page';
import { CozinhaPage } from './pages/cozinha/cozinha.page';
import { RelatoriosPage } from './pages/relatorios/relatorios.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RespostaGuard]
  },
  {
    path: 'colaboradores',
    component: ColaboradoresPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'cardapio',
    component: CardapioPage,
    canActivate: [RespostaGuard]
  },
  {
    path: 'restaurante',
    component: RestaurantePage,
    canActivate: [RespostaGuard]
  },
  {
    path: 'cozinha',
    component: CozinhaPage,
    canActivate: [RespostaGuard]
  },
  {
    path: 'relatorios',
    component: RelatoriosPage,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  },
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
