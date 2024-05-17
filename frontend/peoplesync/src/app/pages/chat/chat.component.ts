import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { UserChatService } from '../../services/userChat.service';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { MessageApiService } from '../../services/message.service';
import { HttpEvent } from '@angular/common/http';
import io from 'socket.io-client';
import { BACKEND } from '../../config/Config';

interface UploadEvent {
  originalEvent: HttpEvent<any>,
  files: File[]
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private ngUnsubscribe = new Subject();
  chatId: number = 0;
  userId: number = 0;
  updateChatVisible: boolean = false;
  chat: any = {};
  allUsers: any;
  messageToSend: any = { content: '' };
  messages: any[] = [];
  private socket: any;

  constructor(private loginService: LoginService, private router: Router, private userChatService: UserChatService, private userService: UserService, private messageService: MessageService, private messageApi: MessageApiService) {

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
      this.userId = Number(localStorage.getItem('id'));

      this.userChatService.getUserChatsByChatId(this.chatId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
        const chat = response[0].chat;
        this.chat = { name: chat.name, id: chat.id, videocall: chat.videocall, integrantes: [] };
        response.forEach((element: any) => {
          this.chat.integrantes.push(element.user);
        })
      })

      //loadFromApiMessages
      this.messageApi.getMessages().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
        this.messages = response;
      });
    }
    this.createSocketConnection();
  }

  createSocketConnection() {
    //Connect to socket
    this.socket = io(BACKEND);

    //enter the chatSocket
    this.socket.emit('join', this.chatId);

    //Recive message
    this.socket.on('message', (newMessage: any) => {
      this.messages.push(newMessage);
      console.log(this.messages);
    })
  }

  goToChats() {
    this.router.navigate(['/chats']);
  }

  modalUpdateChat() {
    this.updateChatVisible = !this.updateChatVisible;

    this.userService.getAllUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      // console.log(response);
      this.allUsers = response;
    })
  }

  saveUpdateChat() {
    this.userChatService.updateUserChat(this.chat).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.messageService.add({
        severity: 'success', summary: 'success', detail: 'Exito al modificar el chat'
      });

      //Si no esta el usuario lo hecha de la sala
      let isUser: boolean = false;
      this.chat.integrantes.forEach((user: any) => {
        if (user.id === this.userId) {
          isUser = true;
        }
      });
      if (!isUser) {
        this.router.navigate(['/chats']);
      }
    },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar chat' });
      })
  }

  sendMessage() {
    this.messageToSend.chatId = this.chatId;
    this.messageToSend.userId = this.userId;
    this.messageToSend.contentType = 'text';

    if (this.messageToSend.content !== '') {
      this.messageApi.sendMessage(this.messageToSend).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
        this.messageToSend.content = '';
      },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar el mensaje' });
        });
    }
  }

  onUpload(event: UploadEvent) {
    const file = event.files[0];
    //Image or pdf
    if (file.type.split("/")[0] === 'image') {
      this.messageToSend.contentType = "img";
    } else if (file.type.split("/")[1] === 'pdf') {
      this.messageToSend.contentType = "pdf";
    }

    this.fileToBase64(file);
    console.log(file);
  }

  fileToBase64(file: File) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event: any) => {
      const imageBase64 = event.target.result;

      //Send file
      this.messageToSend.content = imageBase64;
      this.messageToSend.chatId = this.chatId;
      this.messageToSend.userId = this.userId;
      console.log(imageBase64);

      if (this.messageToSend.content !== '') {
        this.messageApi.sendMessage(this.messageToSend).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
          this.messageToSend.content = '';
        },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar el mensaje' });
          });
      }
    }
  }

  downloadFile(blob: any) {

  }

  ngOnDestroy(): void {
    //turn off the notification
    this.userChatService.notificationOff().pipe(takeUntil(this.ngUnsubscribe)).subscribe();

    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    localStorage.removeItem('chatId');

    //Leave the socket chat
    this.socket.emit('leave', this.chatId);
  }
}
