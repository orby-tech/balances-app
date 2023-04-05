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
  selectedCar: string = '';

  tags$ = this.settingsService.tags$;

  displayedColumns: string[] = ['title', 'transactionName'];
  dataSource$ = this.tags$;

  constructor(private settingsService: SettingsService) {
    settingsService.load();
  }
}
