import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AddTransactionInput,
  Balance,
  Chain,
  DeleteTransactionInput,
  Transaction,
} from '@common/graphql';
import { UsersService } from 'src/db/users.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { TransactionsService } from '../db/transactions.service';

@Resolver('Transaction')
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query()
  async transactions(
    @UserId() userId,
    @Args('page') page: string,
    @Args('organizationId') organizationId: string,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionsService.getTransactionsById(
      userId,
      page,
      organizationId,
    );
    return transactions;
  }

  @Query()
  async chains(
    @UserId() userId,
    @Args('organizationId') organizationId: string,
  ): Promise<Chain[]> {
    const transactions = await this.transactionsService.getChainsBySubjectId(
      organizationId || userId,
    );
    return transactions;
  }

  @Mutation((returns) => Transaction, { name: 'addTransaction' })
  async addTransaction(
    @Args('addTransactionInput') transaction: AddTransactionInput,
    @UserId() userId,
  ) {
    await this.transactionsService.setTransactionById(userId, transaction);
    return '';
  }

  @Mutation((returns) => Balance, { name: 'deleteTransaction' })
  async deleteTransaction(
    @Args('deleteTransactionInput') transaction: DeleteTransactionInput,
    @UserId() userId,
  ) {
    await this.transactionsService.deleteTransactionById(userId, transaction);
    return '';
  }
}
