import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  AddTransactionInput,
  Bill,
  BillType,
  DeleteTransactionInput,
  Transaction,
  TransactionType,
} from '@common/graphql';
import { UsersService } from 'src/users/users.service';

@Resolver('Transaction')
export class TransactionsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  async transactions(): Promise<Transaction[]> {
    const user = await this.usersService.getTransactionsById(
      '123e4567-e89b-12d3-a456-426614174000',
    );
    return user;
  }

  @Mutation((returns) => Transaction, { name: 'addTransaction' })
  async addBill(@Args('addTransactionInput') transaction: AddTransactionInput) {
    console.log(transaction);
    await this.usersService.setTransactionById(
      '123e4567-e89b-12d3-a456-426614174000',
      transaction,
    );
    return '';
  }

  @Mutation((returns) => Bill, { name: 'deleteTransaction' })
  async deleteBill(
    @Args('deleteTransactionInput') transaction: DeleteTransactionInput,
  ) {
    console.log(transaction);
    await this.usersService.deleteTransactionById(
      '123e4567-e89b-12d3-a456-426614174000',
      transaction.id,
    );
    return '';
  }
}
