import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  private ngUnsubscribe = new Subject();

  constructor(private loginService: LoginService, private router: Router) {

  }

  ngOnInit(): void {
    this.loginService.checkToken().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {

      if (!response) {
        this.router.navigate(['/login']);
      }
    },
      error => {
        console.error(error);
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
