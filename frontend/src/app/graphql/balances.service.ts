import { Injectable } from '@angular/core';
import {
  AddBalanceInput,
  Balance,
  CurrenciesRateData,
  Currency,
  DeleteBalanceInput,
} from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, first, pipe, tap } from 'rxjs';
import { getBalancesWithValuesInMain } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class BalancesService {
  balances$ = new BehaviorSubject<Balance[]>([]);
  mainCurrency$ = new BehaviorSubject<string>('');

  currenciesRateData$ = new BehaviorSubject<CurrenciesRateData[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);

  balancesWithValuesInMain$ = getBalancesWithValuesInMain(
    this.balances$,
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
            balances {
              organization_id
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
        this.balances$.next(result?.data?.balances || []);
        this.currenciesRateData$.next(result?.data?.currenciesRate?.data || []);
        this.currencies$.next(result?.data?.currencies || []);
        this.mainCurrency$.next(result?.data?.settings?.mainCurrency || '');
      });
  }

  addBalance(balance: AddBalanceInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addBalance($addBalanceInput: AddBalanceInput!) {
            addBalance(addBalanceInput: $addBalanceInput) {
              id
            }
          }
        `,
        variables: {
          addBalanceInput: balance,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }

  deleteBalance(balance: DeleteBalanceInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation deleteBalance($deleteBalanceInput: DeleteBalanceInput!) {
            deleteBalance(deleteBalanceInput: $deleteBalanceInput)
          }
        `,
        variables: {
          deleteBalanceInput: balance,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }
}
