import { Injectable } from '@angular/core';
import {
  AddBillInput,
  Bill,
  CurrenciesRateData,
  Currency,
  DeleteBillInput,
} from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, first, pipe, tap } from 'rxjs';
import { getBillsWithValuesInMain } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  bills$ = new BehaviorSubject<Bill[]>([]);
  mainCurrency$ = new BehaviorSubject<string>('');

  currenciesRateData$ = new BehaviorSubject<CurrenciesRateData[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);

  billsWithValuesInMain$ = getBillsWithValuesInMain(
    this.bills$,
    this.mainCurrency$,
    this.currenciesRateData$,
    this.currencies$
  )
  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .query({
        query: gql`
          {
            bills {
              id
              type
              title
              host
              value
              valueInMain
              currencyId
            }
            currencies {
              id
              shortTitle
              title
              internationalSimbol
              internationalShortName
            }
            currenciesRate {
              data {
                code
                value
              }
            }
            settings {
              mainCurrency
            }
          }
        `,
      })
      .pipe(first())
      .subscribe((result: any) => {
        console.log(result?.data);
        this.bills$.next(result?.data?.bills || []);
        this.currenciesRateData$.next(result?.data?.currenciesRate?.data || []);
        this.currencies$.next(result?.data?.currencies || []);
        this.mainCurrency$.next(result?.data?.settings?.mainCurrency || '');
      });
  }

  addBill(bill: AddBillInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addBill($addBillInput: AddBillInput!) {
            addBill(addBillInput: $addBillInput) {
              id
            }
          }
        `,
        variables: {
          addBillInput: bill,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }

  deleteBill(bill: DeleteBillInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation deleteBill($deleteBillInput: DeleteBillInput!) {
            deleteBill(deleteBillInput: $deleteBillInput)
          }
        `,
        variables: {
          deleteBillInput: bill,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }
}
