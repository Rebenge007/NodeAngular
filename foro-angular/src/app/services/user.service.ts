import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { global } from '../services/globals';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	public url: string;
  public identity;
  public token;

  constructor( private _http: HttpClient ) { 
  	this.url = global.url;
  }
  prueba(){
  	return "mensaje para probar que todo funciona correctamente desde el servicio del usuario";
  }

  register( user ): Observable<any>{
  	// convertir el objeto del usuario a un json string
  	let params = JSON.stringify(user); // es un string que contiene un json
  	// definir cabeceras
  	let headers = new HttpHeaders().set('Content-type', 'application/json');
  	// hacer peticion ajax
  	return this._http.post(this.url + 'register', params, {headers: headers});
  }

  signUp( user, gettoken = null): Observable<any>{
    // comprobar si llega el gettoken
    if(gettoken!= null){
      user.gettoken = gettoken;
    }
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login', params, {headers: headers});
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));
    if(identity && identity != null && identity != undefined && identity !== "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;
    }
    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');
    if(token && token != null && token != undefined && token !== "undefined"){
      this.token = token;
    }else{
      this.token = null;
    }
    return this.token;
  }

  update(user): Observable<any>{
    console.log( 'editar usuario' );
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization',this.getToken());
    return this._http.put(this.url + 'update', params, {headers:headers});

  }

  getUsers(): Observable<any>{
    return this._http.get(this.url + 'users');
  }

  getUser( userId ): Observable<any>{
    return this._http.get(this.url + 'user/'+userId);
  }
}
