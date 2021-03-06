import { Component, OnInit ,DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { global } from './services/globals'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ UserService ]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'Foro-angular';
  public identity;
  public token;
  public url;
  public search;

  constructor( 
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
    this.url = global.url;
  }

  ngOnInit(){
  	console.log( this.identity );
  	console.log( this.token );
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logOut(){
    console.log( 'Cerrar Sesión' )
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/inicio']);
  }

  goSearch(){
    this._router.navigate(['/buscar', this.search]);
  }
}
