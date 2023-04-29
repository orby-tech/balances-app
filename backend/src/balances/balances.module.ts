import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BalancesResolver } from './balances.resolver';
import { BalancesService } from './balances.service';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [BalancesResolver, BalancesService],
  imports: [DbModule],
})
export class BalancesModule {}
