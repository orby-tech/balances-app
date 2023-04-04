import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SetMainCurrencyInput, Settings, Transaction } from '@common/graphql';
import { UsersService } from 'src/users/users.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Resolver((of) => Settings)
export class SettingsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Settings)
  async settings(@UserId() userId): Promise<Settings> {
    const user = await this.usersService.getById(userId);
    return {
      mainCurrency: user.main_currency,
      tags: (await this.usersService.getTagsById(userId)).map((tag) => ({
        title: tag.title,
        id: tag.tag_id,
        transactionName: tag.transaction_name,
      })),
    };
  }

  @Mutation((returns) => Transaction, { name: 'setMainCurrency' })
  async setMainCurrency(
    @Args('setMainCurrencyInput') mainCurrency: SetMainCurrencyInput,
    @UserId() userId,
  ) {
    await this.usersService.setMainCurrency(userId, mainCurrency.id);
    return mainCurrency.id;
  }
}
