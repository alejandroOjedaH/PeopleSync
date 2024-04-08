import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  constructor(private loginService: LoginService, private router: Router) {

  }

  ngOnInit(): void {
    this.loginService.checkToken().subscribe((response) => {

      if (!response) {
        this.router.navigate(['/login']);
      }
    },
      error => {
        console.error(error);
      })
  }
}
