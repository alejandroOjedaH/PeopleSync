import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { UserService } from '../../services/user.service.js';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../interfaces/user.interface.js';
import { ChatService } from '../../services/chat.service.js';
import { MessageService } from 'primeng/api';
import { UserChatService } from '../../services/userChat.service.js';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  private ngUnsubscribe = new Subject();
  newChatVisible = false;
  newChat: any = {};
  allUsers: User[] = [];
  id: number;
  allChats: any[] = [];

  constructor(private loginService: LoginService, private router: Router, private userService: UserService, private chatService: ChatService, private messageService: MessageService,
    private userChatService: UserChatService) {
    this.id = Number(localStorage.getItem('id'));
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

    this.traerChats();
  }

  traerChats() {
    this.allChats = [];
    this.userChatService.getUserChats(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      response.forEach((chatAux: any) => {
        const { id, name, videocall } = chatAux.chat;
        let chat: any = { id: id, name: name, videocall: videocall, user: [], updatedAt: chatAux.chat.users_chats[0].updatedAt };

        chatAux.chat.users_chats.forEach((element: any) => {
          chat.user.push(element.user);
        });
        this.allChats.push(chat);
      });
      this.orderChatsByUpdate();
      console.log(this.allChats);
    })
  }

  orderChatsByUpdate() {
    this.allChats.sort((a: any, b: any) => {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      } else if (a.updatedAt < b.updatedAt) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  modalNewChat() {
    this.newChat = { name: null, integrantes: [] };
    this.newChatVisible = !this.newChatVisible;

    this.userService.getUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      // console.log(response);
      this.allUsers = response;
    })
  }

  saveNewChat() {
    // console.log(this.newChat);
    this.newChatVisible = !this.newChatVisible;


    this.newChat.integrantes.push({ id: this.id });

    this.chatService.createChat(this.newChat).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.messageService.add({
        severity: 'success', summary: 'success', detail: 'Exito al crear el chat'
      });
      this.traerChats();
    },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear chat' });
      })
  }

  goChat(idChat: any) {
    localStorage.setItem('chatId', idChat);
    this.router.navigate(['/chat']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
