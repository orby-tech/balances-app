import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { BalancesService } from 'src/app/graphql/balances.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { AddBalanceComponent } from '../dialogs/add-balance/add-balance.component';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.scss'],
})
export class BalancesComponent implements OnInit {
  organizationId$ = new BehaviorSubject<string | null>(null);
  balancesWithValuesInMain$ = combineLatest([
    this.balancesService.balancesWithValuesInMain$,
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
  dataSource$ = combineLatest([
    this.balancesForForm$,
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

  datasets$ = this.balancesWithValuesInMain$.pipe(
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
    private currenciesService: CurrenciesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.balancesService.load();
    this.currenciesService.load();

    this.route.params.subscribe((data) => {
      this.organizationId$.next(data['id']);
    });
  }

  addBalance() {
    const dialogRef = this.dialog.open(AddBalanceComponent, {
      data: { type: 'CARD' },
    });

    console.log(this.organizationId$);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.organizationId$.subscribe((organizationId) => {
          this.balancesService.addBalance({
            ...result,
            organizationId,
          });
        });
      }
    });
  }

  deleteBalance(id: string) {
    this.balancesService.deleteBalance({
      id,
    });
  }
}
