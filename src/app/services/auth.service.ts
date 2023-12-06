import { Injectable } from '@angular/core';
import { AuthModel } from '../models/auth.model';
import { ApiService } from './api.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public TipUsuario: string = '';
  public userAuth: boolean;

  constructor(private as: ApiService,) {}

  async login(data: AuthModel) {
    return await this.as
      .req('logins', [], 'post', data, false, false, false)
      .then(async (data) => {
        if (data) {
          try {
            let tokenData: any = jwt_decode(data.token);
            let authResult = {
              tokenData,
              token: data,
            };
            this.userAuth = true;
            this.setStorege(authResult);
            return authResult;
          } catch (err: any) {
            this.userAuth = false;
            throw new Error(err);
          }
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.error("mensagem de erro: ", err)
        throw new Error(err);
      });
  }
  setStorege(data) {
    localStorage.setItem('token', data.token.token);
    localStorage.setItem('acesso', data.tokenData.acesso);
    localStorage.setItem('idcol', data.tokenData.sub);
    localStorage.setItem('nome', data.tokenData.nome );
    localStorage.setItem('email', data.tokenData.email );
    localStorage.setItem('primeiroAcesso', data.tokenData.primeiroAcesso);
  }

  isAuthenticated() {
    return this.userAuth;
  }
}
