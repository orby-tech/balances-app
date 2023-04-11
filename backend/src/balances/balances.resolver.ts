import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddBalanceInput, Balance, BalanceType, DeleteBalanceInput } from '@common/graphql';
import { UsersService } from 'src/users/users.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Resolver((of) => Balance)
export class BalancesResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Balance)
  async balances(@UserId() userId): Promise<Balance[]> {
    const user = await this.usersService.getBalancesById(userId);

    return user.map((balance) => ({
      id: balance.balance_id,
      title: balance.title,
      host: balance.host,
      type: balance.type as BalanceType,
      value: balance.value,
      valueInMain: balance.value * 10,
      currencyId: balance.currency_id,
    }));
  }

  @Mutation((returns) => Balance, { name: 'addBalance' })
  async addBalance(@Args('addBalanceInput') user: AddBalanceInput, @UserId() userId) {
    return {
      id: (await this.usersService.setBalanceById(userId, user))?.balance_id,
    };
  }

  @Mutation((returns) => Balance, { name: 'deleteBalance' })
  async deleteBalance(
    @Args('deleteBalanceInput') balance: DeleteBalanceInput,
    @UserId() userId,
  ) {
    await this.usersService.deleteBalanceById(userId, balance.id);
    return '';
  }
}
