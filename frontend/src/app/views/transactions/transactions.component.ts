import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, map } from 'rxjs';
import { BillsService } from 'src/app/graphql/bills.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { TransactionsService } from 'src/app/graphql/transactions.service';
import { AddTransactionComponent } from '../dialogs/add-transaction/add-transaction.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  transactions$ = this.transactionsService.transactions$;

  transactionsToFrom$ = this.transactionsService.filledTransactions$

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

  dataSource$ = this.transactionsToFrom$;

  constructor(
    private transactionsService: TransactionsService,
    private billsService: BillsService,
    private currenciesService: CurrenciesService,
    public dialog: MatDialog
  ) {
    this.transactionsService.load();
    this.billsService.load();
    this.currenciesService.load();
  }

  addTransaction() {
    console.log('add bill');

    const dialogRef = this.dialog.open(AddTransactionComponent, {
      data: { type: 'TRANSFER', provider: '123' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.transactionsService.addTransaction(result);
      }
    });
  }

  deleteTransaction(id: string) {
    this.transactionsService.deleteTransaction({
      id,
    });
  }

  getBillTitleByBillId(billId: string) {
    return this.billsService.bills$
      .getValue()
      .find((bill) => bill.id === billId)?.title;
  }
}
