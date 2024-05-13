import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { UserChatService } from '../../services/userChat.service';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private ngUnsubscribe = new Subject();
  chatId: number = 0;
  updateChatVisible: boolean = false;
  chat: any = {};
  allUsers: any;

  constructor(private loginService: LoginService, private router: Router, private userChatService: UserChatService, private userService: UserService, private messageService: MessageService) {
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

      this.userChatService.getUserChatsByChatId(this.chatId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
        const chat = response[0].chat;
        this.chat = { name: chat.name, id: chat.id, videocall: chat.videocall, integrantes: [] };
        response.forEach((element: any) => {
          this.chat.integrantes.push(element.user);
        })
        console.log(this.chat);
      })
    }
  }


  goToChats() {
    this.router.navigate(['/chats']);
  }

  modalUpdateChat() {
    this.updateChatVisible = !this.updateChatVisible;

    this.userService.getAllUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      console.log(response);
      this.allUsers = response;
    })
  }

  saveUpdateChat() {
    this.userChatService.updateUserChat(this.chat).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.messageService.add({
        severity: 'success', summary: 'success', detail: 'Exito al modificar el chat'
      });
    },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar chat' });
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    localStorage.removeItem('chatId');
  }
}
