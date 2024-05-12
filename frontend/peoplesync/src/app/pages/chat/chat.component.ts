import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private ngUnsubscribe = new Subject();
  chatId: number = 0;

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
        this.router.navigate(['/login']);
      })

    if (!localStorage.getItem('chatId')) {
      this.router.navigate(['/chats']);
    }
    else {
      this.chatId = Number(localStorage.getItem('chatId'));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    localStorage.removeItem('chatId');
  }
}
