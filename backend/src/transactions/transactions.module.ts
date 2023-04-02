import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [TransactionsService, TransactionsResolver],
  imports: [UsersModule],
})
export class TransactionsModule {}
