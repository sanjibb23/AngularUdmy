import { Component,OnInit } from '@angular/core';
import { AccountService } from './_Services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private accountService : AccountService) { }
  ngOnInit(): void {
    this.setcurrentUser();
  }
  
 
  setcurrentUser() {
    const user = localStorage.getItem('user');
    if(!user) return;
    const userObject = JSON.parse(user);
    this.accountService.currentUser.next(userObject);
  }
  


}
