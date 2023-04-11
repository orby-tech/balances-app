import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AddTransactionInput,
  Balance,
  DeleteTransactionInput,
  Transaction,
} from '@common/graphql';
import { UsersService } from 'src/users/users.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Resolver('Transaction')
export class TransactionsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  async transactions(@UserId() userId): Promise<Transaction[]> {
    const transactions = await this.usersService.getTransactionsById(userId);
    return transactions;
  }

  @Mutation((returns) => Transaction, { name: 'addTransaction' })
  async addBalance(
    @Args('addTransactionInput') transaction: AddTransactionInput,
    @UserId() userId,
  ) {
    await this.usersService.setTransactionById(userId, transaction);
    return '';
  }

  @Mutation((returns) => Balance, { name: 'deleteTransaction' })
  async deleteBalance(
    @Args('deleteTransactionInput') transaction: DeleteTransactionInput,
    @UserId() userId,
  ) {
    await this.usersService.deleteTransactionById(userId, transaction.id);
    return '';
  }
}
