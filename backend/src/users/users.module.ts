import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Balance,
  Currency,
  Tag,
  Transactions,
  TransactionTags,
  User,
  UserBalances,
  UserCurrencies,
  UserTag,
  UserTransactions,
} from './entities/user/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';

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
      UserTransactions,
      TransactionTags,
    ]),
  ],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
