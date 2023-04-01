import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { CommonService } from 'src/app/graphql/common.service';
import Chart from 'chart.js/auto';
import { CurrenciesService } from 'src/app/graphql/currencies.service';

@Component({
  selector: 'app-app-common',
  templateUrl: './app-common.component.html',
  styleUrls: ['./app-common.component.scss'],
})
export class AppCommonComponent {
  displayedColumns: string[] = ['name', 'value'];

  bills$ = this.commonService.bills$;

  billsWithValuesInMain$ = this.commonService.billsWithValuesInMain$;

  dataSourceMain$ = this.billsWithValuesInMain$.pipe(
    map((bills) =>
      bills.map((bill) => ({
        name: bill.title,
        value: bill.valueInMain,
        internationalSimbol: bill.internationalSimbolOfMain,
      }))
    )
  );

  dataSourceInNative$ = this.billsWithValuesInMain$.pipe(
    map((bills) =>
      bills.map((bill) => ({
        name: bill.title,
        value: bill.value,
        internationalSimbol: bill.internationalSimbol,
      }))
    )
  );

  datasets$ = combineLatest([
    this.billsWithValuesInMain$,
  ]).pipe(
    map(([billsWithValuesInMain]) => {
      const datasets = [
        {
          label: 'Bills',
          data: [...billsWithValuesInMain.map((bill) => bill.valueInMain)],
        },
      ];
      return datasets;
    })
  );

  constructor(
    private commonService: CommonService,
  ) {
    commonService.load();
  }
}
