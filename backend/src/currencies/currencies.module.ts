import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesResolver } from './currencies.resolver';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [CurrenciesService, CurrenciesResolver],
  imports: [DbModule, HttpModule],
})
export class CurrenciesModule {}
