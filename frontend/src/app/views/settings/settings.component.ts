import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { SettingsService } from 'src/app/graphql/settings.service';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

export interface PeriodicElement {
  name: string;
  type: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Hydrogen', type: ' 1.0079' },
  { name: 'Helium', type: ' 4.0026' },
  { name: 'Lithium', type: ' 6.941' },
  { name: 'Beryllium', type: ' 9.0122' },
  { name: 'Boron', type: ' 10.811' },
  { name: 'Carbon', type: ' 12.0107' },
  { name: 'Nitrogen', type: ' 14.0067' },
  { name: 'Oxygen', type: ' 15.9994' },
  { name: 'Fluorine', type: ' 18.9984' },
  { name: 'Neon', type: ' 20.1797' },
];

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
}
