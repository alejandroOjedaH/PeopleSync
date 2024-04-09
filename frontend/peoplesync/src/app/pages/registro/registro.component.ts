import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  username: string | undefined;
  mail: string | undefined;
  password: string | undefined;
  repassword: string | undefined;

  constructor(private userService: LoginService, private router: Router, private messageService: MessageService) {

  }
  irLogin() {
    this.router.navigate(['/login']);
  }

  registrarse() {
    if (this.password === this.repassword) {
      const user: any = {};
      user.username = this.username;
      user.email = this.mail;
      user.password = this.password;
      this.userService.registry(user).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: "Exito", detail: "Registro exitoso" });
          this.router.navigate(['/login']);
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar' });
        }
      );
    }
  }

}
