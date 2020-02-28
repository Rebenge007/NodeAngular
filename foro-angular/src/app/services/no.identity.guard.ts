import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoIdentityGuard implements CanActivate {
	constructor(
		private _router: Router,
		private _userService: UserService
	){

	}
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  canActivate(){
  	let identity = this._userService.getIdentity();
  	if(identity && identity.name){
  		this._router.navigate(['/']);
  		return false;
  	}else{
  		return true;
  	}
  }
  
}
