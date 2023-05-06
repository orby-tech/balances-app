import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LoginComponent } from '../dialogs/login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  tryDemo() {
    this.httpClient
      .post<{ status: number; access_token?: string }>('/auth/login', {
        username: 'user@user.com',
        password: 'changeme',
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
          setTimeout(() => {
            this.router.navigate(['/common']);
          }, 1000);
        }
      });
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.validateToken();
    });
  }

  signUp() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: {
        openSignUp: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.validateToken();
    });
  }
}
