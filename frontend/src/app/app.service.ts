import { Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './views/dialogs/login/login.component';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(public dialog: MatDialog, private router: Router) {
  }


}
