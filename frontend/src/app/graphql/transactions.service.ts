import { Injectable } from '@angular/core';
import {
  AddTransactionInput,
  Bill,
  CurrenciesRateData,
  Currency,
  DeleteTransactionInput,
  Transaction,
} from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

export const getTransactionsWithValuesInMain = (
  transactions$: BehaviorSubject<Transaction[]>,
  bills$: BehaviorSubject<Bill[]>,
  mainCurrency$: BehaviorSubject<string>,
  currenciesRateData$: BehaviorSubject<CurrenciesRateData[]>,
  currencies$: BehaviorSubject<Currency[]>
) =>
  combineLatest([
    transactions$,
    bills$,
    mainCurrency$,
    currenciesRateData$,
    currencies$,
  ]).pipe(
    map(
      ([
        transactions,
        bills,
        mainCurrencyId,
        currenciesRateData,
        currencies,
      ]) => {
        return transactions.map((transaction) => {
          const tobill = bills.find((bill) => bill?.id === transaction.to);
          const frombill = bills.find((bill) => bill?.id === transaction.from);

          const toCurrency = currencies.find(
            (c) => c.id === tobill?.currencyId
          );
          const toInternationalShortName = currencies.find(
            (c) => c.id === toCurrency?.id
          )?.internationalShortName;

          const toCoef =
            currenciesRateData.find((c) => c.code === toInternationalShortName)
              ?.value || 1;

          const fromCurrency = currencies.find(
            (c) => c.id === frombill?.currencyId
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
            toTitle: tobill?.title,
            fromTitle: frombill?.title,
            toCurrencyTitle: currencies.find((c) => c.id === tobill?.currencyId)
              ?.title,
            fromCurrencyTitle: currencies.find(
              (c) => c.id === frombill?.currencyId
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
  bills$ = new BehaviorSubject<Bill[]>([]);
  mainCurrency$ = new BehaviorSubject<string>('');

  currenciesRateData$ = new BehaviorSubject<CurrenciesRateData[]>([]);
  currencies$ = new BehaviorSubject<Currency[]>([]);

  filledTransactions$ = getTransactionsWithValuesInMain(
    this.transactions$,
    this.bills$,
    this.mainCurrency$,
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
              id
              type
              title
              host
              value
              valueInMain
              currencyId
            }
            transactions(page: 0) {
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
              fee
              feeInPercents
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
      .valueChanges.subscribe((result: any) => {
        console.log(result?.data);
        this.transactions$.next(result?.data?.transactions || []);
        this.bills$.next(result?.data?.bills || []);
        this.currenciesRateData$.next(result?.data?.currenciesRate?.data || []);
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
        this.load();
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
        this.load();
      });
  }
}
