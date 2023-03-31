import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { combineLatest, map } from 'rxjs';
import { BillsService } from 'src/app/graphql/bills.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { AddBillComponent } from '../dialogs/add-bill/add-bill.component';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  bills$ = this.billsService.bills$;
  billsForForm$ = combineLatest([
    this.bills$,
    this.currenciesService.currencies$,
  ]).pipe(
    map(([bills, currencies]) =>
      bills.map((bill) => {
        return {
          ...bill,
          valueWithSuffix: `${bill.value} ${
            currencies.find((c) => c.id === bill.currencyId)?.internationalSimbol
          }`,
        };
      })
    )
  );
  chart: Chart<'doughnut', number[], string> | null = null;

  displayedColumns: string[] = [
    'name',
    'type',
    'host',
    'value',
    'valueInMain',
    'delete',
  ];
  dataSource$ = this.billsForForm$;

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

  constructor(
    private billsService: BillsService,
    public dialog: MatDialog,
    private currenciesService: CurrenciesService
  ) {}

  ngOnInit() {
    this.billsService.load();
    this.currenciesService.load();
  }

  addBill() {
    console.log('add bill');

    const dialogRef = this.dialog.open(AddBillComponent, {
      data: { type: 'CARD' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.billsService.addBill(result);
      }
    });
  }

  deleteBill(id: string) {
    this.billsService.deleteBill({
      id,
    });
  }
}
