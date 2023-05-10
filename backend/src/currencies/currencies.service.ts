import { CurrenciesRate, Currency } from '@common/graphql';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrenciesService {
  ratesHistory: CurrenciesRate[] = [];
  currencies: Currency[] = [];

  constructor(private readonly httpService: HttpService) {
    this.httpService
      .get<CurrenciesRate[]>(
        'http://currencies.orby-tech.space/api/rates-history',
      )
      .subscribe((x) => {
        this.ratesHistory = x.data;
      });

    this.httpService
      .get<Currency[]>('http://currencies.orby-tech.space/api/currencies')
      .subscribe((x) => {
        this.currencies = x.data;
        console.log('this.currencies', this.currencies);
      });
  }

  async getCurrencies(): Promise<Currency[]> {
    console.log('getCurrencies', this.currencies);
    return this.currencies;
  }

  async getLatest(): Promise<CurrenciesRate[]> {
    return this.ratesHistory;
  }
}
