import { Injectable } from '@angular/core';
import { AddTransactionInput, DeleteTransactionInput, Transaction } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
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
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result?.data);
        this.transactions$.next(result?.data?.transactions || []);
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
          mutation deleteTransaction($deleteTransactionInput: DeleteTransactionInput!) {
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
