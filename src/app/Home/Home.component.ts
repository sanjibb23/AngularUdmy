import { Component, OnInit } from '@angular/core';
@Component({
  templateUrl: './Home.component.html'
})
export class HomeComponent implements  OnInit {
  registerMode = false;
 
  constructor() { }
  ngOnInit(): void {
   
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
 
}