import { Injectable } from '@angular/core';
import { Balance, CurrenciesRate, Currency } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesService {
  balances$ = new BehaviorSubject<Balance[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);
  currenciesRate$ = new BehaviorSubject<CurrenciesRate[]>([]);

  currenciesWithValueRelatedMain$ = combineLatest([
    this.currencies$,
    this.currenciesRate$,
    this.balances$,
  ]).pipe(
    map(([currencies, currenciesRateData, balances]) => {
      return currencies.map((currency) => ({
        ...currency,
        valueRelatedMain: currenciesRateData.find(
          (data) => data.code === currency.internationalShortName
        )?.value,
        summedUp: balances
          .filter((b) => b.currencyId === currency.id)
          .reduce((p, c) => p + c.value, 0),
      }));
    })
  );

  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            balances {
              organization_id
              id
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
              code
              value
              date
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.balances$.next(result?.data?.balances || []);
        this.currencies$.next(result?.data?.currencies || []);
        this.currenciesRate$.next(result?.data?.currenciesRate || []);
      });
  }
}
