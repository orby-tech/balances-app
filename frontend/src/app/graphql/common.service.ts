import { Injectable, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Bill, CurrenciesRateData, Currency } from '@common/graphql';

export const getBillsWithValuesInMain = (
  bills$: BehaviorSubject<Bill[]>,
  currenciesRateData$: BehaviorSubject<CurrenciesRateData[]>,
  currencies$: BehaviorSubject<Currency[]>
) =>
  combineLatest([bills$, currenciesRateData$, currencies$]).pipe(
    map(([bills, currenciesRateData, currencies]) => {
      return bills.map((bill) => {
        const currency = currencies.find((c) => c.id === bill.currencyId);
        const internationalShortName = currencies.find(
          (c) => c.id === bill.currencyId
        )?.internationalShortName;

        const coef =
          currenciesRateData.find((c) => c.code === internationalShortName)
            ?.value || 1;

        const mainCurrency = currencies.find(
          (c) => c.internationalShortName === 'USD'
        );

        return {
          ...bill,
          valueInMain: bill.value / coef,
          internationalSimbol: currency?.internationalSimbol || '',
          internationalSimbolOfMain: mainCurrency?.internationalSimbol || '',
        };
      });
    })
  );

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  bills$ = new BehaviorSubject<Bill[]>([]);
  currenciesRateData$ = new BehaviorSubject<CurrenciesRateData[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);

  dataSourceMain$ = this.bills$.pipe(
    map((bills) =>
      bills.map((bill) => ({ name: bill.title, value: bill.valueInMain }))
    )
  );

  dataSourceInNative$ = this.bills$.pipe(
    map((bills) =>
      bills.map((bill) => ({ name: bill.title, value: bill.value }))
    )
  );

  billsWithValuesInMain$ = getBillsWithValuesInMain(
    this.bills$,
    this.currenciesRateData$,
    this.currencies$
  );

  constructor(private apollo: Apollo) {}

  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            bills {
              title
              value
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
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result?.data);
        this.bills$.next(result?.data?.bills || []);
        this.currenciesRateData$.next(result?.data?.currenciesRate?.data || []);
        this.currencies$.next(result?.data?.currencies || []);
      });
  }
}
