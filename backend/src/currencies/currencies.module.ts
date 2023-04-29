import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesResolver } from './currencies.resolver';
import { UsersModule } from 'src/users/users.module';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [CurrenciesService, CurrenciesResolver],
  imports: [DbModule],
})
export class CurrenciesModule {}
