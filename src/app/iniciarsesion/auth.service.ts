import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  /* tslint:disable-next-line: variable-name */
  public _usuario: Usuario;
  /* tslint:disable-next-line: variable-name */
  public _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if ( this._usuario !== null ) {
      return this._usuario;
    } else if ( this._usuario === null && sessionStorage.getItem('usuario') !== null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if ( this._token != null ) {
      return this._token;
    } else if ( this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
  }

  login(usuario: Usuario): Observable<any> {

    const urlEndPoint = 'http://localhost:5000/oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + credenciales,
    });

    let params = new URLSearchParams();
    params.set ('grant_type', 'password');
    params.set ('username', usuario.username);
    params.set ('password', usuario.password);

    return this.http.post<any>(urlEndPoint, params.toString(), {headers: httpHeaders});
  }

  /* tslint:disable-next-line: variable-name */
  guardarUsuario( access_token: string): void {
    // tslint:disable-next-line: prefer-const
    let payload = this.obtenerDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.id = payload.id;
    this._usuario.username = payload.user_name;
    this._usuario.roles  = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  /* tslint:disable-next-line: variable-name */
  guardarToken( access_token: string): void {
    this._token = access_token;
    sessionStorage.setItem('token', access_token);
  }

  /* tslint:disable-next-line: variable-name */
  obtenerDatosToken( access_token: string): any {
    if (access_token != null) {
      return JSON.parse(atob(access_token.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    // tslint:disable-next-line: prefer-const
    let payload = this.obtenerDatosToken(this._token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: any): boolean {
    if (this.usuario != null && this.usuario.roles != null && this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

  obtenerDatosUser() {
    if ( this._usuario !== null ) {
      return this._usuario;
    } else if ( this._usuario === null && sessionStorage.getItem('usuario') !== null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }


}
