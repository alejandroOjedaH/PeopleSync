import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  sidebarVisible: boolean = false;

  constructor(private router: Router) {

  }

  goChats() {
    this.router.navigate(['/chats']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  closeSession() {
    localStorage.setItem('token', '');
    this.router.navigate(['../login']);
  }
}
