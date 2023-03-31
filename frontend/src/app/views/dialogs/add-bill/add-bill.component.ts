import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddBillInput } from '@common/graphql';
import { CurrenciesService } from 'src/app/graphql/currencies.service';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent {

  currencies$ = this.currenciesService.currencies$
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddBillInput,
    private currenciesService: CurrenciesService
  ) {
    this.currenciesService.load()
  }
}
