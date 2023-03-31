import { Injectable } from '@angular/core';
import { Currency } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesService {
  currencies$ = new BehaviorSubject<Currency[]>([]);

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
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result?.data);
        this.currencies$.next(result?.data?.currencies || []);
      });
  }
}
