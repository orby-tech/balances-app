import { Injectable } from '@angular/core';
import {
  SetMainCurrencyInput,
  SetNewPasswordInput,
  Settings,
  SignUpInput,
} from '@common/graphql';
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
        this.mainCurrency$.next(result?.data?.settings?.mainCurrency || []);
        this.tags$.next(result?.data?.settings?.tags || []);
      });
  }

  setMainCurrency(currencyId: SetMainCurrencyInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation setMainCurrency(
            $setMainCurrencyInput: SetMainCurrencyInput!
          ) {
            setMainCurrency(setMainCurrencyInput: $setMainCurrencyInput)
          }
        `,
        variables: {
          setMainCurrencyInput: currencyId,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }

  setNewPassword(password: SetNewPasswordInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation setNewPassword($setNewPasswordInput: SetNewPasswordInput!) {
            setNewPassword(setNewPasswordInput: $setNewPasswordInput)
          }
        `,
        variables: {
          setNewPasswordInput: password,
        },
      })
      .subscribe((x) => {
        this.load();
        localStorage.removeItem('token');
      });
  }

  signUp(signUp: SignUpInput) {
   return this.apollo
      .mutate({
        mutation: gql`
          mutation signUp($signUpInput: SignUpInput!) {
            signUp(signUpInput: $signUpInput)
          }
        `,
        variables: {
          signUpInput: signUp,
        },
      })
     
  }
}
