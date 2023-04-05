import { Component } from '@angular/core';
import { TransactionType } from '@common/graphql';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { SettingsService } from 'src/app/graphql/settings.service';
import { UserService } from 'src/app/graphql/user.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent {
  transactionType = TransactionType;
  user$ = this.userService.user$;
  userMainCurrency$ = this.userService.userMainCurrency$;
  mainCurrency$ = this.settingsService.mainCurrency$;
  currencies$ = this.currenciesService.currencies$;

  newPassword = '';
  newPasswordConfirm = '';

  selectedValue: string = '';

  constructor(
    private userService: UserService,
    private currenciesService: CurrenciesService,
    private settingsService: SettingsService
  ) {
    this.userService.load();
    this.settingsService.load();
    this.currenciesService.load();

    this.mainCurrency$.subscribe((currency) => {
      this.selectedValue = currency;
    });
  }

  selectMainCurrency() {
    this.settingsService.setMainCurrency({ id: this.selectedValue });
  }

  changePassword() {}

  updatePassword() {
    this.settingsService.setNewPassword({ password: this.newPassword });
  }
}
