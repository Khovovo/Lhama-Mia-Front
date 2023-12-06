import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }
  
  canActivate(): Observable<boolean> | Promise<boolean> | boolean  {
    if(!localStorage.getItem('token')){
      return true      
    }else{
      this.router.navigate(['home'])
      return false
    }

  }

  
}
