import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { CommonService } from 'src/app/graphql/common.service';

@Component({
  selector: 'app-app-common',
  templateUrl: './app-common.component.html',
  styleUrls: ['./app-common.component.scss'],
})
export class AppCommonComponent implements OnInit {
  displayedColumns: string[] = ['name', 'value'];

  balances$ = this.commonService.balances$;
  organizationId$ = new BehaviorSubject<string | null>(null);

  balancesWithValuesInMain$ = combineLatest([
    this.commonService.balancesWithValuesInMain$,
    this.organizationId$,
  ]).pipe(
    map(([balancesForForm, organizationId]) => {
      return balancesForForm.filter(
        (b) =>
          b.organization_id === organizationId ||
          (b.organization_id === 'userBalance' && !organizationId)
      );
    })
  );

  internationalSimbolOfMain$ = this.balancesWithValuesInMain$.pipe(
    map((balancesWithValuesInMain) => {

      return balancesWithValuesInMain[0]?.internationalSimbolOfMain;
    })
  );

  summedUpValueinMain$ = this.balancesWithValuesInMain$.pipe(
    map((balancesWithValuesInMain) => {
      return balancesWithValuesInMain
        .map((b) => b.valueInMain)
        .reduce((a, b) => a + b, 0);
    })
  );

  dataSourceMain$ = combineLatest([
    this.balancesWithValuesInMain$,
    this.organizationId$,
  ])
    .pipe(
      map(([balancesForForm, organizationId]) => {
        return balancesForForm.filter(
          (b) =>
            b.organization_id === organizationId ||
            (b.organization_id === 'userBalance' && !organizationId)
        );
      })
    )
    .pipe(
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

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {
    commonService.load();
  }

  ngOnInit() {
    this.route.params.subscribe((data) => {
      this.organizationId$.next(data['id']);
    });
  }
}
