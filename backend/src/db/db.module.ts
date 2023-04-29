import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserTag,
  UserCurrencies,
  UserBalances,
  Transactions,
  TransactionTags,
  UserOrganisation,
  OrganizationBalances,
  ChainItem,
  User,
  Tag,
  Currency,
  Balance,
  Organization,
  Chain,
} from 'src/db/entities/user/user.entity';
import { UsersService } from './users.service';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Tag,
      UserTag,
      UserCurrencies,
      Currency,
      Balance,
      UserBalances,
      Transactions,
      TransactionTags,
      Organization,
      UserOrganisation,
      OrganizationBalances,
      ChainItem,
      Chain,
    ]),
  ],
  providers: [UsersService, TransactionsService],
  controllers: [],
  exports: [UsersService, TransactionsService],
})
export class DbModule {}
