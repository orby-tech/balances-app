import { Injectable } from '@angular/core';
import { AddBillInput, Bill, DeleteBillInput } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, first, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  bills$ = new BehaviorSubject<Bill[]>([]);

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
          }
        `,
      })
      .pipe(first())
      .subscribe((result: any) => {
        console.log(result?.data);
        this.bills$.next(result?.data?.bills || []);
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
