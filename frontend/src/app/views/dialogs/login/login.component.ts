import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(private httpClient: HttpClient, private dialog: MatDialog) {}

  submit() {
    if (!document) {
      return;
    }

    this.httpClient
      .post<{ access_token?: string }>('/auth/login', {
        username: this.login,
        password: this.password,
      })
      .subscribe((x) => {
        const access_token = x.access_token;
        if (access_token) {
          localStorage.setItem('token', access_token);
        }
        window.location.reload();
      });
  }

  signUpOpen() {
    const dialogRef = this.dialog.open(SignUpComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The SignUpComponent dialog was closed');
    });
  }
}
