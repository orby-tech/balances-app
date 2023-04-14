import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { CommonService } from 'src/app/graphql/common.service';

@Component({
  selector: 'app-app-common',
  templateUrl: './app-common.component.html',
  styleUrls: ['./app-common.component.scss'],
})
export class AppCommonComponent {
  displayedColumns: string[] = ['name', 'value'];

  balances$ = this.commonService.balances$;

  balancesWithValuesInMain$ = this.commonService.balancesWithValuesInMain$;

  dataSourceMain$ = this.balancesWithValuesInMain$.pipe(
    map((balances) =>
      balances.map((balance) => ({
        name: balance.title,
        value: balance.valueInMain,
        internationalSimbol: balance.internationalSimbolOfMain,
      }))
    )
  );

  dataSourceInNative$ = this.balancesWithValuesInMain$.pipe(
    map((balances) =>
      balances.map((balance) => ({
        name: balance.title,
        value: balance.value,
        internationalSimbol: balance.internationalSimbol,
      }))
    )
  );

  datasets$ = combineLatest([this.balancesWithValuesInMain$]).pipe(
    map(([balancesWithValuesInMain]) => {
      const datasets = [
        {
          label: 'Balances',
          data: [
            ...balancesWithValuesInMain.map((balance) => balance.valueInMain),
          ],
        },
      ];
      return datasets;
    })
  );

  constructor(private commonService: CommonService) {
    commonService.load();
  }
}
