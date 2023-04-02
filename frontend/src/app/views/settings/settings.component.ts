import { Component } from '@angular/core';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { SettingsService } from 'src/app/graphql/settings.service';

export interface PeriodicElement {
  name: string;
  type: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  selectedValue: string = '';
  selectedCar: string = '';

  foods$ = this.currenciesService.currencies$;
  mainCurrency$ = this.settingsService.mainCurrency$;
  tags$ = this.settingsService.tags$;

  displayedColumns: string[] = ['title', 'transactionName'];
  dataSource$ = this.tags$;

  constructor(
    private currenciesService: CurrenciesService,
    private settingsService: SettingsService
  ) {
    currenciesService.load();
    settingsService.load();

    this.mainCurrency$.subscribe((currency) => {
      this.selectedValue = currency;
    });
  }

  selectMainCurrency() {
    this.settingsService.setMainCurrency({ id: this.selectedValue });
  }
}
