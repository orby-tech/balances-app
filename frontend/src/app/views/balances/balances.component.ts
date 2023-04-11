import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { combineLatest, map } from 'rxjs';
import { BalancesService } from 'src/app/graphql/balances.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { AddBalanceComponent } from '../dialogs/add-balance/add-balance.component';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.scss'],
})
export class BalancesComponent implements OnInit {
  balances$ = this.balancesService.balances$;

  balancesWithValuesInMain$ = this.balancesService.balancesWithValuesInMain$;

  balancesForForm$ = this.balancesWithValuesInMain$;

  chart: Chart<'doughnut', number[], string> | null = null;

  displayedColumns: string[] = [
    'name',
    'type',
    'host',
    'value',
    'valueInMain',
    'delete',
  ];
  dataSource$ = this.balancesForForm$;

  datasets$ = this.balances$.pipe(
    map((balances) => {
      const datasets = [
        {
          label: 'Balances',
          data: [...balances.map((balance) => balance.valueInMain)],
        },
      ];
      return datasets;
    })
  );

  constructor(
    private balancesService: BalancesService,
    public dialog: MatDialog,
    private currenciesService: CurrenciesService
  ) {}

  ngOnInit() {
    this.balancesService.load();
    this.currenciesService.load();
  }

  addBalance() {
    const dialogRef = this.dialog.open(AddBalanceComponent, {
      data: { type: 'CARD' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.balancesService.addBalance(result);
      }
    });
  }

  deleteBalance(id: string) {
    this.balancesService.deleteBalance({
      id,
    });
  }
}
