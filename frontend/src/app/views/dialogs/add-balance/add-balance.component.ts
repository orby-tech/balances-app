import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddBalanceInput } from '@common/graphql';
import { CurrenciesService } from 'src/app/graphql/currencies.service';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss'],
})
export class AddBalanceComponent {

  currencies$ = this.currenciesService.currencies$
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddBalanceInput,
    private currenciesService: CurrenciesService
  ) {
    this.currenciesService.load()
  }
}
