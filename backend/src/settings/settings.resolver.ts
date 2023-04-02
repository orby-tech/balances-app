import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SetMainCurrencyInput, Settings, Transaction } from '@common/graphql';
import { UsersService } from 'src/users/users.service';

@Resolver((of) => Settings)
export class SettingsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Settings)
  async settings(): Promise<Settings> {
    const user = await this.usersService.getById(
      '123e4567-e89b-12d3-a456-426614174000',
    );
    return {
      mainCurrency: user.main_currency,
      tags: (
        await this.usersService.getTagsById(
          '123e4567-e89b-12d3-a456-426614174000',
        )
      ).map((tag) => ({
        title: tag.title,
        id: tag.tag_id,
        transactionName: tag.transaction_name,
      })),
    };
  }

  @Mutation((returns) => Transaction, { name: 'setMainCurrency' })
  async setMainCurrency(
    @Args('setMainCurrencyInput') transaction: SetMainCurrencyInput,
  ) {
    await this.usersService.setMainCurrency(
      '123e4567-e89b-12d3-a456-426614174000',
      transaction.id,
    );
    return transaction.id;
  }
}
