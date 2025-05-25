import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  model: any = { };
  constructor(public accountService: AccountService) { }
  registersuccess : boolean = false;
  registersuccessMessage : string = '';
  ngOnInit(): void {
  }
  register() {
    this.isLoading = true;
    this.registersuccess = false;
    this.registersuccessMessage = '';
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.registersuccess = true;
        this.registersuccessMessage = 'Registration Successful';
        
      },
      error: (error) => {
        this.isLoading = false;
        this.registersuccess = false;
        console.log(error);
        if (error.error.errors) {
          this.registersuccessMessage = error.error.errors[0];
        } else if (error.statusText === "OK" && error.error) {
          this.registersuccessMessage = error.error;
        } else {    
        this.registersuccessMessage = 'Error Occured Registration Failed Please try again later';
        }
      }
    });
  }

@Output ()  cancelRegister: EventEmitter<boolean> = new EventEmitter<boolean>();
  cancel() {
    this.cancelRegister.emit(false);
  }

}
