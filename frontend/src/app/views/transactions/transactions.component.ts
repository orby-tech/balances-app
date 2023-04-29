import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, combineLatest } from 'rxjs';
import { BalancesService } from 'src/app/graphql/balances.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { TransactionsService } from 'src/app/graphql/transactions.service';
import { AddTransactionComponent } from '../dialogs/add-transaction/add-transaction.component';
import { TransactionStatus } from '@common/graphql';

type StatusFilter =
  | 'all'
  | TransactionStatus.ACTIVE
  | TransactionStatus.ARCHIVED;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions$ = this.transactionsService.transactions$;

  transactionsToForm$ = this.transactionsService.filledTransactionsWithChains$;
  organizationId$ = new BehaviorSubject<string | null>(null);

  displayedColumns: string[] = [
    'provider',
    'type',
    'to',
    'toValue',
    'toCurrency',
    'from',
    'fromValue',
    'fromCurrency',
    'fee',
    'feeInPercents',
    'delete',
  ];
  chart: any | null = null;
  TransactionStatus= TransactionStatus
  _statusFilter: StatusFilter = TransactionStatus.ACTIVE;
  statusFilter$ = new BehaviorSubject<StatusFilter>(this._statusFilter);
  get statusFilter() {
    return this._statusFilter;
  }
  set statusFilter(value) {
    this._statusFilter = value;
    this.statusFilter$.next(value);
  }

  dataSource$ = combineLatest([
    this.transactionsToForm$,
    this.statusFilter$,
  ]).pipe(
    map(([transactionsToForm, statusFilter]) => {
      return transactionsToForm.filter(
        (t) => t.status === statusFilter || statusFilter === 'all'
      );
    })
  );

  constructor(
    private transactionsService: TransactionsService,
    private balancesService: BalancesService,
    private currenciesService: CurrenciesService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.balancesService.load();
    this.currenciesService.load();
  }

  ngOnInit() {
    this.route.params.subscribe((data) => {
      const organizationId = data['id'];
      this.transactionsService.load(organizationId || null);
      this.organizationId$.next(organizationId);
    });
  }

  addTransaction() {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      data: { type: 'TRANSFER', provider: '123' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.transactionsService.addTransaction({
          ...result,
          organizationId: this.organizationId$.getValue(),
        });
      }
    });
  }

  deleteTransaction(id: string) {
    this.transactionsService.deleteTransaction({
      id,
      organizationId: this.organizationId$.getValue(),
    });
  }

  getBalanceTitleByBalanceId(balanceId: string) {
    return this.balancesService.balances$
      .getValue()
      .find((balance) => balance.id === balanceId)?.title;
  }
}
