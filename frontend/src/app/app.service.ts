import { Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './views/dialogs/login/login.component';

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(public dialog: MatDialog) {
    this.validateToken();
  }

  validateToken(): void {
    const token = localStorage.getItem('token');
    const exp = token ? parseJwt(token)?.exp || 0 : 0;
    const expSeconds = exp * 1000 - Date.now();

    if (expSeconds < 0) {
      const dialogRef = this.dialog.open(LoginComponent, {
        data: {},
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        this.validateToken();
      });
    } else {
      setTimeout(() => {
        this.validateToken();
      }, 1000);
    }
  }
}
