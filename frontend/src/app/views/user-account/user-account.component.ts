import { Component } from '@angular/core';
import { TransactionType } from '@common/graphql';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { OrganizationsService } from 'src/app/graphql/organizations.service';
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
  organizations$ = this.organizationsService.organizations$;

  newPassword = '';
  newPasswordConfirm = '';

  selectedValue: string = '';

  constructor(
    private userService: UserService,
    private currenciesService: CurrenciesService,
    private settingsService: SettingsService,
    private organizationsService: OrganizationsService
  ) {
    this.userService.load();
    this.settingsService.load();
    this.currenciesService.load();
    this.organizationsService.load();

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

  addOrganization() {
    this.organizationsService.addOrganization({ name: 'Family' });
  }
}
