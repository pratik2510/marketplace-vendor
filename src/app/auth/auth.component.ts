import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  template: `
  <ngx-auth-column-layout>
      <router-outlet></router-outlet>
  </ngx-auth-column-layout>
  `
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
