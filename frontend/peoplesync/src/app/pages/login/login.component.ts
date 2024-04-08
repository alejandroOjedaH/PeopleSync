import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: string | null = null;
  password: string | null = null;

  constructor(private loginService: LoginService, private router: Router) {

  }

  login(): void {
    if (this.user && this.password) {
      const response = this.loginService.login(this.user, this.password).subscribe(
        (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/chats']);
        },
        error => {
          console.error(error);
        }
      );
    }
  }
}
