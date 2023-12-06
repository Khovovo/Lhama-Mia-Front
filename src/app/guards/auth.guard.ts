import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean  {
    if (localStorage.getItem('token') && (localStorage.getItem('acesso') == 'true' ) && (localStorage.getItem('primeiroAcesso') == 'true') ){
      return true
    } else if(localStorage.getItem('token') && (localStorage.getItem('acesso') == 'true' )){
      return true
    }else if (localStorage.getItem('token') && (localStorage.getItem('acesso') == 'false' ) && (localStorage.getItem('primeiroAcesso') == 'true')){
      this.router.navigate(['home'])
      return false
    }else if (localStorage.getItem('token') && (localStorage.getItem('acesso') == 'false' ) && (localStorage.getItem('primeiroAcesso') == 'false')){
      this.router.navigate(['home'])
      return false
    }

    this.router.navigate(['login'])
    return false
  }

}
