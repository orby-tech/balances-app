import { CurrenciesRate } from '@common/graphql';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrenciesService {
  ratesHistory: CurrenciesRate[] = [];

  constructor(private readonly httpService: HttpService) {
    this.httpService
      .get<CurrenciesRate[]>(
        'http://currencies.orby-tech.space/api/rates-history',
      )
      .subscribe((x) => {
        this.ratesHistory = x.data;
      });
  }

  async getLatest(): Promise<CurrenciesRate[]> {
    return this.ratesHistory;
  }
}
