import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/globals'


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [ UserService ]
})
export class UserEditComponent implements OnInit {
	public page_title: string;
	public user: User;
	public identity;
	public token;
	public status;
	public afuConfig; // Angular-file-Uploader
	public url;

  constructor(
  	private _router: Router,
  	private _activatedRoute: ActivatedRoute,
  	private _userService: UserService
  ) { 
  	this.page_title = 'Actualizar ajustes de usuario';
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
  	this.user = this.identity;
  	this.url = global.url;
  	this.afuConfig = {
  		multiple: false,
  		formatAllowed: '.jpg, .jpeg, .png, .gif',
  		maxSize: "50",
  		uploadAPI: {
  			url: this.url + "upload-avatar",
  			headers: {
  				"Authorization": this.token
  			}
  		},
  		theme: "attachPin",
  		hideProgressBar: false,
  		hideResetBtn: true,
  		hideSelectBtn: false,
  		//attachPinText: "Sube tu foto"
  		replaceTexts: {
  			selectFileBtn: '',
  			resetBtn: '',
  			uploadBtn: '',
  			dragNDopBox: '',
  			attachPinBtn: 'Sube tu foto',
  			afterUploadMsg_success: '',
  			afterUploadMsg_error: ''
  		}
  	}
  }

  ngOnInit() {
  }

  avatarUpload( data ){
  	console.log( data );
  	let data_obj = JSON.parse(data.response);
  	this.user.image = data_obj.user.image;
  	console.log( this.user );
  }

  onSubmit(){
  	this._userService.update( this.user ).subscribe(
  		response =>{
  			if(response.user){
  				this.status = 'success';
  				localStorage.setItem('identity', JSON.stringify(this.user));
  			}else{
  				this.status = 'error';
  			}
  		},
  		error => {
  			this.status = 'error';
  			console.log( error );
  		}
  	);
  }

}
