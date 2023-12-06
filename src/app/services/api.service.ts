import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReqParams } from '../helpers/reqparams.helper';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headers: HttpHeaders = new HttpHeaders({});
  private url: string = '';
  private prod = environment;

  constructor(
    private http: HttpClient
  ) { }

  public get getEnv(): boolean {
    return this.prod.production;
  }

  private async config(res: string, params: ReqParams[], headers: boolean, other: boolean, content: boolean): Promise<string> {

    if (this.prod.production)
      this.url = `https://${this.prod.ipprimario + res}/`;
    else
      this.url = `http://${this.prod.ipprimario + res}/`;

    params.forEach((p) => {
      this.url = this.url + p.value + '/';
    });

    return this.url;
  }

  /**
  * Realiza um requisição.
  * @param res Nome do resource (conforme API).
  * @param params Parâmetros da consulta.
  * @param type Tipo da requisição (get, post, put ou delete).
  * @param body Corpo da requisição.
  * @param headers Indica se haverá necessidade de ter cabeçalhos.
  * @param log Indica se haverá necessidade de registrar log da requisição realizada.
  * @param other Se for TRUE, indica que a consulta é em outro ponto de conexão, e não na API.
  * @param content Alternância entre o tipo de conteúdo.
  */

   public async req(
    res: string,
    params: ReqParams[],
    type: string,
    body: any,
    headers: boolean,
    log: boolean,
    other: boolean,
    content?: boolean
  ): Promise<any> {

    const url = await this.config(res, params, headers, other, content);
    type = type.toLowerCase();

    try {
      // console.log('entrou')
      let serverData: HttpResponse<any>;
      if (type === 'post' || type === 'put' || type === 'patch') {
        if (content) {
          serverData = await this.http[type](url, body, { observe: 'response', headers: this.headers, responseType: 'blob' }).toPromise();
        } else
          serverData = await this.http[type](url, body, { observe: 'response', headers: this.headers }).toPromise();
      } else if (type === 'delete') {
        serverData = await this.http.delete(url, { observe: 'response', headers: this.headers }).toPromise();
      } else {

        if (content) {
          serverData = await this.http.get(url, { observe: 'response', headers: this.headers, responseType: 'blob' }).toPromise();
        } else
          serverData = await this.http.get(url, { observe: 'response', headers: this.headers }).toPromise();
      }


      if (content) {
        return serverData.body;
      }
      return serverData.body
      // return JSON.parse(JSON.stringify(lib.decodeJSON(JSON.stringify(serverData.body), true)));
    } catch (error: any) {
      throw (error);
    }
  }
}
