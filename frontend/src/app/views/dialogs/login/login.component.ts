import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(private httpClient: HttpClient) {}

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
}
