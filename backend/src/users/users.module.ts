import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Bill,
  Currency,
  Tag,
  Transactions,
  TransactionTags,
  User,
  UserBills,
  UserCurrencies,
  UserTag,
  UserTransactions,
} from './entities/user/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Tag,
      UserTag,
      UserCurrencies,
      Currency,
      Bill,
      UserBills,
      Transactions,
      UserTransactions,
      TransactionTags,
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
