import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { BACKEND } from '../../config/Config';

@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrl: './videocall.component.css'
})
export class VideocallComponent {
  private ngUnsubscribe = new Subject();
  private socket: any;
  @ViewChild('localVideo') localVideo?: any;
  @ViewChild('remoteVideo') remoteVideo?: any;
  private callId: string = 'some-call-id';
  private userId: number = 0;

  configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  pc: any;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    this.pc = new RTCPeerConnection(this.configuration);
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
    this.callId = 'videocall' + localStorage.getItem('callId');
    this.userId = Number(localStorage.getItem('id'));

    this.createSocketConnection();
  }

  createSocketConnection() {

    this.socket = io(BACKEND);

    this.socket.emit('joinVideocall', { callId: this.callId });

    this.socket.on('userDisconnected', () => {
      this.pc.close();
      this.router.navigate(['/chats']);
    });


    this.socket.on('offer', async (data: any) => {
      await this.pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      this.socket.emit('answer', { answer: this.pc.localDescription, callId: this.callId });
    });

    this.socket.on('answer', async (data: any) => {
      await this.pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    this.socket.on('candidate', async (data: any) => {
      await this.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    this.pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        this.socket.emit('candidate', { candidate: event.candidate, callId: this.callId });
      }
    };

    this.pc.ontrack = (event: any) => {
      this.remoteVideo!.nativeElement.srcObject = event.streams[0];
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.localVideo!.nativeElement.srcObject = stream;
      stream.getTracks().forEach((track) => {
        this.pc.addTrack(track, stream);
      });

      this.pc.createOffer().then((offer: any) => {
        return this.pc.setLocalDescription(offer);
      }).then(() => {
        this.socket.emit('offer', { offer: this.pc.localDescription, callId: this.callId });
      });
    }).catch((error) => {
      console.error('Error accediendo a dispositivos de medios.', error);
    });
  }

  goToChats() {
    this.router.navigate(['/chats']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    this.pc.close();
    this.socket.emit('leaveVideocall', { callId: this.callId });

    // this.socket.emit('leave', this.callId);
    localStorage.removeItem('callId');
  }
}
