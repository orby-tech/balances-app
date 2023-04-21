import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  submit() {
    if (!document) {
      return;
    }

    this.runLogin(this.login, this.password);
  }

  async runLogin(email: string, password: string) {
    this.httpClient
      .post<{ status: number; access_token?: string }>('/auth/login', {
        username: email,
        password: password,
      })
      .pipe(
        catchError((e) => {
          console.log(e);
          if (e.status === 401) {
            console.log('Login failed');
            let snackBarRef = this.snackBar.open('Wrong login or password');
          }
          return of();
        })
      )
      .subscribe((x) => {
        const access_token = x.access_token;
        if (access_token) {
          localStorage.setItem('token', access_token);
        }
        window.location.reload();
      });
  }

  signUpOpen() {
    const dialogRef = this.dialog.open<
      SignUpComponent,
      {},
      { password: string; email: string }
    >(SignUpComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.runLogin(result.email, result.password);
    });
  }
}
