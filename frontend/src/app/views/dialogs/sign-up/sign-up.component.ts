import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
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
        this.dialogRef.close();
      });
  }
}
