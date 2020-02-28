import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
	public page_title: string;
	public user: User;
	public status: string;
	public identity;
	public token;

  constructor( 
  	private _userSErvice: UserService, 
  	private _router: Router,
  	private _activatedRoute: ActivatedRoute
  ) { 
  	this.page_title = 'Identificate';
  	this.user = new User('', '', '', '', '', '', 'ROLE_USER');
  }

  ngOnInit() {
  }

  onSubmit(form){
  	console.log( form );
  	// conseguir objeto completo del usuario logeado
  	this._userSErvice.signUp(this.user).subscribe(
  		response => {
  			if(response.user && response.user._id){
  				console.log( response );
  				// guardar el usuario en una propiedad
  				this.identity = response.user;
  				localStorage.setItem('identity', JSON.stringify(this.identity));

  				// conseguir el token del usuario identificado
  				this._userSErvice.signUp(this.user, true).subscribe(
			  		response => {
			  			if(response.token){
			  				console.log( response );
			  				// guardar el token del usuario
			  				this.token = response.token;
			  				localStorage.setItem('token', this.token );
			  				this.status = 'success';
			  				this._router.navigate(['/inicio']);
			  			}else{
			  				this.status = 'error';
			  			}
			  		},
			  		error => {
			  			console.log( error );
			  		}
			  	);

  			}else{
  				this.status = 'error';
  			}
  		},
  		error => {
  			console.log( error );
  		}
  	);
  }

}
