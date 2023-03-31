import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTransactionInput, TransactionType } from '@common/graphql';
import { BehaviorSubject } from 'rxjs';
import { BillsService } from 'src/app/graphql/bills.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent {
  transactionType = TransactionType;

  bills$ = this.billsService.bills$;

  toCurrency$ = new BehaviorSubject<string>(''); 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddTransactionInput,
    private billsService: BillsService
  ) {
    this.billsService.load();
  }

  dataToSelect(){
    console.log(this.data)
  }
}
