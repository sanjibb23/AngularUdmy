import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_Services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
message = 'Waiting for update...';
  constructor(public accountService: AccountService, 
    private router : Router,private toastr: ToastrService) { }
  loggedIn: boolean;
  model :any = {};
  User?: string;
  ngOnInit(): void {
   // this.accountService.currentUser$;
    var currentuser = this.accountService.getCurrentUser()?.UserName;
    this.User = currentuser;

    // add notification service
  //  this.notificationService.startConnection();
  //  this.notificationService.onNotification((message: string) => {
    //  this.message = message;
     // console.log('Notification received: ', message);
     // alert('Notification received: ' + message);
  //  }
  //  );


  }
  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        this.User = this.accountService.getCurrentUser()?.UserName;
       // console.log(response);
        this.toastr.success('Successfully Logged', 'Success');
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        console.log(error);
       // this.toastr.error(error, 'Error');
      }
    });
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastr.success('Successfully Logged Out', 'Success');
  }

}
