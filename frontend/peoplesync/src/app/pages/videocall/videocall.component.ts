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
  callId: string = '';
  userId: number = 0;
  private socket: any;
  @ViewChild('myVideo') myVideo?: ElementRef;
  @ViewChild('peerVideo') peerVideo?: ElementRef;
  peerConnection?: RTCPeerConnection;
  localStream?: MediaStream;
  remoteStream?: MediaStream;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {

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
    this.startVideoCall();
  }

  createSocketConnection() {
    this.socket = io(BACKEND);
  }

  joinRoom() {
    this.socket.emit('joinVideocall', { callId: this.callId, userId: this.userId });
  }

  onUserConnected(callback: (userId: string) => void) {
    this.socket.on('userConnected', callback);
  }

  onUserDisconnected(callback: (userId: string) => void) {
    this.socket.on('userDisconnected', callback);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  onOffer(callback: (offer: RTCSessionDescriptionInit) => void) {
    this.socket.on('offer', callback);
  }

  onAnswer(callback: (answer: RTCSessionDescriptionInit) => void) {
    this.socket.on('answer', callback);
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    this.socket.on('ice-candidate', callback);
  }

  async startVideoCall() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.myVideo!.nativeElement.srcObject = this.localStream;

    const configuration = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    };

    this.peerConnection = new RTCPeerConnection(configuration);
    this.remoteStream = new MediaStream();

    this.peerVideo!.nativeElement.srcObject = this.remoteStream;

    this.localStream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, this.localStream!);
      console.log("entra");
    });

    this.peerConnection.ontrack = (event) => {
      console.log("Evento ontrack recibido:", event);
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream?.addTrack(track);
      });
    };

    this.peerConnection.onnegotiationneeded = async () => {
      try {
        const offer = await this.peerConnection?.createOffer();
        await this.peerConnection?.setLocalDescription(offer);
        this.emit('offer', offer);
      } catch (err) {
        console.error('Error al crear la oferta:', err);
      }
    };

    this.onUserConnected(async (userId) => {
      const offer = await this.peerConnection?.createOffer();
      await this.peerConnection?.setLocalDescription(offer);
      this.socket.emit('offer', offer, userId);
    });

    this.onOffer(async (offer: any) => {
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection?.createAnswer();
      await this.peerConnection?.setLocalDescription(answer);
      this.emit('answer', answer);
    });

    this.onAnswer(async (answer: any) => {
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.onIceCandidate((candidate: any) => {
      this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    this.socket.emit('leave', this.callId);
    // this.socket.emit('leave', this.callId);
    localStorage.removeItem('callId');
  }
}
