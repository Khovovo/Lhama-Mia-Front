import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespostaGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(
  ): Observable<boolean> | Promise<boolean> | boolean  {
    if(localStorage.getItem('token')){
      return true
    }

    this.router.navigate(['login'])
    return false
  }
}
