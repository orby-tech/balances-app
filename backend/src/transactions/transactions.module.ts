import { Module } from '@nestjs/common';
import { TransactionsService } from '../db/transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainItem, Chain } from 'src/db/entities/user/user.entity';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [TransactionsResolver],
  imports: [DbModule],
  exports: [TransactionsResolver],
})
export class TransactionsModule {}
