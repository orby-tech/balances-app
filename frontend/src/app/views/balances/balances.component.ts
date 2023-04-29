import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { BalancesService } from 'src/app/graphql/balances.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { AddBalanceComponent } from '../dialogs/add-balance/add-balance.component';
import { BalanceStatus } from '@common/graphql';

type StatusFilter = 'all' | BalanceStatus.ACTIVE | BalanceStatus.ARCHIVED;

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

  _statusFilter : StatusFilter = BalanceStatus.ARCHIVED;
  statusFilter$ = new BehaviorSubject<StatusFilter>(this._statusFilter);
  get statusFilter() { 
    return this._statusFilter;
  }
  set statusFilter(value) {
    this._statusFilter = value;
    this.statusFilter$.next(value);
  }

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
    this.statusFilter$
  ]).pipe(
    map(([balancesForForm, organizationId, statusFilter]) => {
      return balancesForForm.filter(
        (b) =>
          b.organization_id === organizationId ||
          (b.organization_id === 'userBalance' && !organizationId)
      ).filter(b=> {
        if (statusFilter === 'all') {
          return true;
        }
        return b.status === statusFilter;
      });
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
