import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(private accountService: AccountService,
  private toastr: ToastrService ) {}

  canActivate(
  ):boolean {
    const isLoggedIn = localStorage.getItem('user'); 
    if (isLoggedIn) {
      return true;
    }else {
      this.toastr.error('You are not logged in');
      return false;
    }
  }
}
