import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesResolver } from './currencies.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [CurrenciesService, CurrenciesResolver],
  imports: [UsersModule],
})
export class CurrenciesModule {}
