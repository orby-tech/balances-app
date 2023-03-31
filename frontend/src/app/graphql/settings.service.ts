import { Injectable } from '@angular/core';
import { Settings } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  mainCurrency$ = new BehaviorSubject<Settings['mainCurrency']>('');
  tags$ = new BehaviorSubject<Settings['tags']>([]);

  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            settings {
              mainCurrency
              tags {
                id
                title
                transactionName
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result?.data);
        this.mainCurrency$.next(result?.data?.settings?.mainCurrency || []);
        this.tags$.next(result?.data?.settings?.tags || []);
      });
  }
}
