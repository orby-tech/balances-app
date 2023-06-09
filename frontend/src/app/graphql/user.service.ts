import { Injectable } from '@angular/core';
import { Currency, User } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, first, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$ = new BehaviorSubject<User | null>(null);
  currencies$ = new BehaviorSubject<Currency[] | null>(null);

  userMainCurrency$ = combineLatest([this.user$, this.currencies$]).pipe(
    map(([user, currencies]) =>
      currencies?.find((currency) => currency.id === user?.mainCurrency)
    )
  );

  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .query({
        query: gql`
          {
            user {
              email
              mainCurrency
            }
            currencies {
              id
              title
              internationalSimbol
              internationalShortName
            }
          }
        `,
      })
      .pipe(first())
      .subscribe((result: any) => {
        this.user$.next(result?.data?.user || []);
        this.currencies$.next(result?.data?.currencies || []);
      });
  }
}
