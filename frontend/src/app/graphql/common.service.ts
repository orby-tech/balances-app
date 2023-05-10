import { Injectable, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Balance, CurrenciesRate, Currency } from '@common/graphql';

export const getBalancesWithValuesInMain = (
  balances$: BehaviorSubject<Balance[]>,
  mainCurrency$: BehaviorSubject<string>,
  currenciesRate$: BehaviorSubject<CurrenciesRate[]>,
  currencies$: BehaviorSubject<Currency[]>
) =>
  combineLatest([balances$, mainCurrency$, currenciesRate$, currencies$]).pipe(
    map(([balances, mainCurrencyId, currenciesRateData, currencies]) => {
      return balances.map((balance) => {
        const currency = currencies.find((c) => c.id === balance.currencyId);
        const internationalShortName = currencies.find(
          (c) => c.id === balance.currencyId
        )?.internationalShortName;

        const coef =
          currenciesRateData.find((c) => c.code === internationalShortName)
            ?.value || 1;

        const mainCurrency = currencies.find((c) => c.id === mainCurrencyId);
        const antCoef =
          currenciesRateData.find(
            (c) => c.code === mainCurrency?.internationalShortName
          )?.value || 1;

        return {
          ...balance,
          valueInMain: (balance.value / coef) * antCoef,
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
  balances$ = new BehaviorSubject<Balance[]>([]);
  mainCurrency$ = new BehaviorSubject<string>('');
  currenciesRate$ = new BehaviorSubject<CurrenciesRate[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);

  dataSourceMain$ = this.balances$.pipe(
    map((balances) =>
      balances.map((balance) => ({
        name: balance.title,
        value: balance.valueInMain,
      }))
    )
  );

  dataSourceInNative$ = this.balances$.pipe(
    map((balances) =>
      balances.map((balance) => ({ name: balance.title, value: balance.value }))
    )
  );

  balancesWithValuesInMain$ = getBalancesWithValuesInMain(
    this.balances$,
    this.mainCurrency$,
    this.currenciesRate$,
    this.currencies$
  );

  constructor(private apollo: Apollo) {}

  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            balances {
              organization_id
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
              code
              value
            }
            settings {
              mainCurrency
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.balances$.next(result?.data?.balances || []);
        this.currenciesRate$.next(result?.data?.currenciesRate || []);
        this.currencies$.next(result?.data?.currencies || []);
        this.mainCurrency$.next(result?.data?.settings?.mainCurrency || '');
      });
  }
}
