import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BalancesResolver } from './balances.resolver';
import { BalancesService } from './balances.service';

@Module({
  providers: [BalancesResolver, BalancesService],
  imports: [UsersModule],
})
export class BalancesModule {}
