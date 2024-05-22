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
  @ViewChild('localVideo') localVideo?: ElementRef;
  @ViewChild('remoteVideo') remoteVideo?: ElementRef;
  private peerConnection?: RTCPeerConnection;
  private localStream?: MediaStream;
  private callId: string = 'some-call-id';
  private userId: number = 0;
  private iceCandidatesQueue: RTCIceCandidate[] = [];
  private remoteDescriptionSet: boolean = false;

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
  }

  createSocketConnection() {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const pc = new RTCPeerConnection(configuration);

    const socket = io('http://localhost:3000');

    socket.on('offer', async (data) => {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer: pc.localDescription });
    });

    socket.on('answer', async (data) => {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('candidate', async (data) => {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      this.remoteVideo!.nativeElement.srcObject = event.streams[0];
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.localVideo!.nativeElement.srcObject = stream;
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.createOffer().then((offer) => {
        return pc.setLocalDescription(offer);
      }).then(() => {
        socket.emit('offer', { offer: pc.localDescription });
      });
    }).catch((error) => {
      console.error('Error accediendo a dispositivos de medios.', error);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    this.socket.emit('leave', this.callId);
    // this.socket.emit('leave', this.callId);
    localStorage.removeItem('callId');
  }
}
