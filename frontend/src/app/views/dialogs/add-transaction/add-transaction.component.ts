import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTransactionInput, TransactionType } from '@common/graphql';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';
import { BalancesService } from 'src/app/graphql/balances.service';
import { CurrenciesService } from 'src/app/graphql/currencies.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent {
  defaultTransactionType = TransactionType.TRANSFER;
  transactionType = TransactionType;

  balances$ = this.balancesService.balancesWithValuesInMain$;

  toCurrency$ = new BehaviorSubject<string>('');

  toValueWasSetted$ = new BehaviorSubject<boolean>(false);
  fromValueWasSetted$ = new BehaviorSubject<boolean>(false);

  profileForm = new FormGroup(
    {
      type: new FormControl<TransactionType>(this.defaultTransactionType),
      to: new FormControl(''),
      toValue: new FormControl<number | null>({ value: 0, disabled: true }),
      from: new FormControl(''),
      fromValue: new FormControl<number | null>({
        value: 0,
        disabled: true,
      }),
      provider: new FormControl('123'),
    },
    { updateOn: 'blur' }
  );

  type$ = this.profileForm.valueChanges.pipe(
    map((data) => data.type),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    startWith(this.defaultTransactionType)
  );

  fromBalanceInternationalSimbol$ = combineLatest([
    this.profileForm.valueChanges.pipe(
      map((value) => value.from),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    this.balances$,
  ]).pipe(
    map(
      ([from, balances]) =>
        balances.find((balance) => balance.id === from)?.internationalSimbol || ''
    )
  );

  toBalanceInternationalSimbol$ = combineLatest([
    this.profileForm.valueChanges.pipe(
      map((value) => value.to),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    this.balances$,
  ]).pipe(
    map(
      ([to, balances]) =>
        balances.find((balance) => balance.id === to)?.internationalSimbol || ''
    )
  );

  toAndFromCurrencies$ = combineLatest([
    this.profileForm.valueChanges.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    this.balances$,
    this.currenciesService.currenciesWithValueRelatedMain$,
  ]).pipe(
    map(([value, balances, currenciesWithValueRelatedMain]) => {
      const toCurrency = currenciesWithValueRelatedMain.find(
        (c) => c.id === balances.find((balance) => balance.id === value.to)?.currencyId
      );
      const fromCurrency = currenciesWithValueRelatedMain.find(
        (c) => c.id === balances.find((balance) => balance.id === value.from)?.currencyId
      );

      return { toCurrency, fromCurrency };
    })
  );

  toValueInFromCurrency$ = combineLatest([
    this.profileForm.valueChanges.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    this.toAndFromCurrencies$,
  ]).pipe(
    map(([value, { toCurrency, fromCurrency }]) => {
      return (
        ((value.toValue || 0) / (toCurrency?.valueRelatedMain || 0)) *
        (fromCurrency?.valueRelatedMain || 0)
      );
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

  fromValueInToCurrency$ = combineLatest([
    this.profileForm.valueChanges.pipe(
      map((value) => value.fromValue),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    this.toAndFromCurrencies$,
  ]).pipe(
    map(([fromValue, { toCurrency, fromCurrency }]) => {
      return (
        ((fromValue || 0) / (fromCurrency?.valueRelatedMain || 0)) *
        (toCurrency?.valueRelatedMain || 0)
      );
    })
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddTransactionInput,
    private balancesService: BalancesService,
    private currenciesService: CurrenciesService
  ) {
    this.balancesService.load();
    currenciesService.load();
    this.profileForm.valueChanges
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((value) => {
        if (value.type === TransactionType.TRANSFER && value.from && value.to) {
          this.profileForm.controls['fromValue'].enable();
          this.profileForm.controls['toValue'].enable();
        } else if (value.type === TransactionType.RECEIVE && value.to) {
          this.profileForm.controls['fromValue'].enable();
          this.profileForm.controls['toValue'].enable();
        } else if (value.type === TransactionType.SEND && value.from) {
          this.profileForm.controls['fromValue'].enable();
          this.profileForm.controls['toValue'].enable();
        } else {
          this.profileForm.controls['fromValue'].disable();
          this.profileForm.controls['toValue'].disable();
        }
      });

    combineLatest([
      this.profileForm.valueChanges.pipe(
        map((value) => value.toValue),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        debounceTime(500)
      ),
      this.toAndFromCurrencies$,
      this.type$.pipe(map((type) => type === TransactionType.TRANSFER)),
    ]).subscribe(([toValue, { toCurrency, fromCurrency }, editingOn]) => {
      if (!editingOn) {
        return;
      }

      if (!toValue) {
        return;
      }
      this.toValueWasSetted$.next(!!toValue);
      const fromValueWasSetted = this.fromValueWasSetted$.getValue();
      if (!fromValueWasSetted) {
        const newFromValue =
          ((toValue || 0) / (toCurrency?.valueRelatedMain || 0)) *
          (fromCurrency?.valueRelatedMain || 0);

        this.profileForm.patchValue({ fromValue: newFromValue });
        this.profileForm.updateValueAndValidity();
      }
    });

    combineLatest([
      this.profileForm.valueChanges.pipe(
        map((value) => value.fromValue),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        debounceTime(500)
      ),
      this.toAndFromCurrencies$,
      this.type$.pipe(map((type) => type === TransactionType.TRANSFER)),
    ]).subscribe(([fromValue, { toCurrency, fromCurrency }, editingOn]) => {
      if (!editingOn) {
        return;
      }

      if (!fromValue) {
        return;
      }
      this.fromValueWasSetted$.next(!!fromValue);
      const toValueWasSetted = this.toValueWasSetted$.getValue();
      if (!toValueWasSetted) {
        const newToValue =
          ((fromValue || 0) * (toCurrency?.valueRelatedMain || 0)) /
          (fromCurrency?.valueRelatedMain || 0);

        this.profileForm.patchValue({
          toValue: newToValue,
        });
        this.profileForm.updateValueAndValidity;
      }
    });

    this.profileForm.valueChanges.subscribe((value: any) => {
      this.data = { ...value };
    });
  }
}
