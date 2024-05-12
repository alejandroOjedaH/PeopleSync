import { Component, OnDestroy } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();
  user: string | null = null;
  password: string | null = null;

  constructor(private loginService: LoginService, private router: Router, private messageService: MessageService) {

  }

  login(): void {
    if (this.user && this.password) {
      this.loginService.login(this.user, this.password).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          localStorage.setItem('id', response.id);
          this.router.navigate(['/chats']);
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usario/Contraseña erronea' });
        }
      );
    }
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
