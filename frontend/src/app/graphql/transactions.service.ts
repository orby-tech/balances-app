import { Injectable } from '@angular/core';
import {
  AddTransactionInput,
  Balance,
  Chain,
  CurrenciesRate,
  Currency,
  DeleteTransactionInput,
  Transaction,
} from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

export const getTransactionsWithValuesInMain = (
  transactions$: BehaviorSubject<Transaction[]>,
  balances$: BehaviorSubject<Balance[]>,
  mainCurrency$: BehaviorSubject<string>,
  currenciesRate$: BehaviorSubject<CurrenciesRate[]>,
  currencies$: BehaviorSubject<Currency[]>
) =>
  combineLatest([
    transactions$,
    balances$,
    mainCurrency$,
    currenciesRate$,
    currencies$,
  ]).pipe(
    map(
      ([
        transactions,
        balances,
        mainCurrencyId,
        currenciesRateData,
        currencies,
      ]) => {
        return transactions.map((transaction) => {
          const tobalance = balances.find(
            (balance) => balance?.id === transaction.to
          );
          const frombalance = balances.find(
            (balance) => balance?.id === transaction.from
          );

          const toCurrency = currencies.find(
            (c) => c.id === tobalance?.currencyId
          );
          const toInternationalShortName = currencies.find(
            (c) => c.id === toCurrency?.id
          )?.internationalShortName;

          const toCoef =
            currenciesRateData.find((c) => c.code === toInternationalShortName)
              ?.value || 1;

          const fromCurrency = currencies.find(
            (c) => c.id === frombalance?.currencyId
          );
          const fromInternationalShortName = currencies.find(
            (c) => c.id === fromCurrency?.id
          )?.internationalShortName;

          const fromCoef =
            currenciesRateData.find(
              (c) => c.code === fromInternationalShortName
            )?.value || 1;

          const mainCurrency = currencies.find((c) => c.id === mainCurrencyId);
          const antCoef =
            currenciesRateData.find(
              (c) => c.code === mainCurrency?.internationalShortName
            )?.value || 1;

          return {
            ...transaction,
            toValueInMain: transaction.toValue
              ? (+transaction.toValue / toCoef) * antCoef
              : null,
            fromValueInMain: transaction.fromValue
              ? (+transaction.fromValue / fromCoef) * antCoef
              : null,
            toInternationalSimbol: toCurrency?.internationalSimbol || '',
            fromInternationalSimbol: fromCurrency?.internationalSimbol || '',
            internationalSimbolOfMain: mainCurrency?.internationalSimbol || '',
            toTitle: tobalance?.title,
            fromTitle: frombalance?.title,
            toCurrencyTitle: currencies.find(
              (c) => c.id === tobalance?.currencyId
            )?.title,
            fromCurrencyTitle: currencies.find(
              (c) => c.id === frombalance?.currencyId
            )?.title,
          };
        });
      }
    )
  );

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  transactions$ = new BehaviorSubject<Transaction[]>([]);
  chains$ = new BehaviorSubject<Chain[]>([]);
  balances$ = new BehaviorSubject<Balance[]>([]);
  mainCurrency$ = new BehaviorSubject<string>('');

  currenciesRate$ = new BehaviorSubject<CurrenciesRate[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);

  filledTransactions$ = getTransactionsWithValuesInMain(
    this.transactions$,
    this.balances$,
    this.mainCurrency$,
    this.currenciesRate$,
    this.currencies$
  );

  filledTransactionsWithChains$ = combineLatest([
    this.filledTransactions$,
    this.chains$,
  ]).pipe(
    map(([filledTransactions, chains]) => {
      return filledTransactions.map((t) => {
        return {
          ...t,
          chainId: chains.find((c) => c.transactionId === t.id)?.chainId,
        };
      });
    })
  );

  organizationId: string | null = null;

  constructor(private apollo: Apollo) {}

  load(organizationId: string | null) {
    this.organizationId = organizationId;
    this.apollo
      .watchQuery({
        query: gql`
          query MyQuery($organizationId: String) {
            balances {
              id
              type
              title
              host
              value
              valueInMain
              currencyId
            }
            transactions(page: 0, organizationId: $organizationId) {
              id
              provider
              type
              tags {
                title
                transactionName
                id
              }
              to
              toValue
              toCurrency
              from
              fromValue
              fromCurrency
              toFee
              fromFee
              toFeeInPercents
              fromFeeInPercents
              status
            }
            chains {
              transactionId
              chainId
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
        variables: {
          organizationId: organizationId,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.transactions$.next(result?.data?.transactions || []);
        this.chains$.next(result?.data?.chains || []);
        this.balances$.next(result?.data?.balances || []);
        this.currenciesRate$.next(result?.data?.currenciesRate || []);
        this.currencies$.next(result?.data?.currencies || []);
        this.mainCurrency$.next(result?.data?.settings?.mainCurrency || '');
      });
  }

  addTransaction(transaction: AddTransactionInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addTransaction($addTransactionInput: AddTransactionInput!) {
            addTransaction(addTransactionInput: $addTransactionInput)
          }
        `,
        variables: {
          addTransactionInput: transaction,
        },
      })
      .subscribe((x) => {
        this.load(this.organizationId);
      });
  }

  deleteTransaction(transaction: DeleteTransactionInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation deleteTransaction(
            $deleteTransactionInput: DeleteTransactionInput!
          ) {
            deleteTransaction(deleteTransactionInput: $deleteTransactionInput)
          }
        `,
        variables: {
          deleteTransactionInput: transaction,
        },
      })
      .subscribe((x) => {
        this.load(this.organizationId);
      });
  }
}
