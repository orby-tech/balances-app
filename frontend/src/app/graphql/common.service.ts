import { Injectable, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map } from 'rxjs';
import { Bill } from '@common/graphql';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  bills$ = new BehaviorSubject<Bill[]>([]);

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

  constructor(private apollo: Apollo) {}

  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            bills {
              title
              host
              value
              valueInMain
              currencyId
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result?.data);
        this.bills$.next(result?.data?.bills || []);
      });
  }
}
