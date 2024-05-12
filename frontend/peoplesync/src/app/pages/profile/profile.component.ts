import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Profile } from '../../interfaces/user.interface';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpEvent } from '@angular/common/http';

interface UploadEvent {
  originalEvent: HttpEvent<any>,
  files: File[]
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private ngUnsubscribe = new Subject();

  profile: Profile = { username: '', password: '', email: '', profileImage: '' };

  id: string | null;

  isEditable: boolean = false;

  password: string = '';
  rePassword: string = '';

  constructor(private loginService: LoginService, private router: Router, private userService: UserService, private messageService: MessageService) {
    this.id = localStorage.getItem('id');
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

    this.userService.getUser(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      this.profile = response;
      console.log(this.profile);
    },
      error => {
        console.error(error);
      })
  }

  onUpload(event: UploadEvent) {
    const imageFile = event.files[0];
    this.fileToBase64(imageFile);
  }

  fileToBase64(file: File) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event: any) => {
      const imageBase64 = event.target.result;
      this.profile.profileImage = imageBase64;
    }
  }

  save() {
    if (this.password !== '' && this.rePassword !== '') {
      this.profile.password = this.password;
    } else {
      delete this.profile.password;
    }

    if (this.password === this.rePassword) {

      this.userService.updateUser(this.profile).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Usuario actualizado' });
      },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        })

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña no coincide' });
    }

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
