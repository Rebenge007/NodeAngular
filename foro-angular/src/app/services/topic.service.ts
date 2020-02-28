import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './globals';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class TopicService {
	public url: string;

  constructor(
  	private _http: HttpClient
  ) {
  		this.url = global.url;
  }

  prueba(){
  	return "mesnaje desde topic services";
  }

  addTopic(token, topic): Observable<any>{
  	let params = JSON.stringify(topic);
  	let headers = new HttpHeaders().set('Content-Type', 'application/json')
  								   .set('Authorization', token );
  	return this._http.post(this.url + 'topic', params, {headers: headers});

  }

  getTopicsByUser(userId): Observable<any>{
  	let headers = new HttpHeaders().set('Content-Type', 'application/json');
  	return  this._http.get(this.url+ 'user-topics/'+userId, {headers: headers})

  }

  update(token, topicId, topic): Observable<any>{
    console.log( 'editar usuario' );
    let params = JSON.stringify(topic);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization',token);
    return this._http.put(this.url + 'topic/'+topicId, params, {headers:headers});

  }

  delete(token, topicId): Observable<any>{
    console.log( 'editar usuario' );
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization',token);
    return this._http.delete(this.url + 'topic/'+topicId, {headers:headers});

  }

  getTopics( page = 1 ): Observable<any>{
    return this._http.get(this.url+'topics/'+page);
  }

  getTopic( topicId ): Observable<any>{
    return this._http.get(this.url + 'topic/'+topicId);

  }

  search( searchString ): Observable<any>{
    return this._http.get(this.url+'search/'+searchString);
  }


}
