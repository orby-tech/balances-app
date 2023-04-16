import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Balance,
  Currency,
  Organization,
  OrganizationBalances,
  Tag,
  Transactions,
  TransactionTags,
  User,
  UserBalances,
  UserCurrencies,
  UserOrganisation,
  UserTag,
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
      TransactionTags,
      Organization,
      UserOrganisation,
      OrganizationBalances
    ]),
  ],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
