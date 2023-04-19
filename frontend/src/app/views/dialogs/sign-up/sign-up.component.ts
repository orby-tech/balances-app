import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from 'src/app/graphql/settings.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  password: string = '';
  email: string = '';
  username: string = '';

  constructor(
    private dialogRef: DialogRef,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private settingService: SettingsService
  ) {}

  signUp() {
    this.settingService
      .signUp({
        password: this.password,
        email: this.email,
        username: this.username,
      })
      .subscribe((x) => {
        console.log(x);
        this.dialogRef.close(
          {
            password: this.password,
            email: this.email,
          },
          {}
        );
      });
  }
}
