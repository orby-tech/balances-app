import { Injectable } from '@angular/core';
import { CurrenciesRateData, Currency } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesService {
  currencies$ = new BehaviorSubject<Currency[]>([]);
  currenciesRateData$ = new BehaviorSubject<CurrenciesRateData[]>([]);

  currenciesWithValueRelatedMain$ = combineLatest([
    this.currencies$,
    this.currenciesRateData$,
  ]).pipe(
    map(([currencies, currenciesRateData]) => {
      return currencies.map((currency) => ({
        ...currency,
        valueRelatedMain: currenciesRateData.find(
          (data) => data.code === currency.internationalShortName
        )?.value,
      }));
    })
  );

  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            currencies {
              id
              shortTitle
              title
              valueRelatedMain
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
        this.currencies$.next(result?.data?.currencies || []);
        this.currenciesRateData$.next(result?.data?.currenciesRate?.data || []);
      });
  }
}
