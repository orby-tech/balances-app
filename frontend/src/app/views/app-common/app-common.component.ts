import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CommonService } from 'src/app/graphql/common.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-app-common',
  templateUrl: './app-common.component.html',
  styleUrls: ['./app-common.component.scss'],
})
export class AppCommonComponent {
  displayedColumns: string[] = ['name', 'value'];

  bills$ = this.commonService.bills$;

  dataSourceMain$ = this.commonService.dataSourceMain$;

  dataSourceInNative$ = this.commonService.dataSourceInNative$;

  datasets$ = this.bills$.pipe(
    map((bills) => {
      const datasets = [
        {
          label: 'Bills',
          data: [...bills.map((bill) => bill.valueInMain)],
        },
      ];
      return datasets;
    })
  );

  constructor(private commonService: CommonService) {
    commonService.load();
  }
}
