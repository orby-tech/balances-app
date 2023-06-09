import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  SetMainCurrencyInput,
  SetNewPasswordInput,
  Settings,
  SignUpInput,
  Transaction,
} from '@common/graphql';
import { UsersService } from 'src/db/users.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { Public } from 'src/auth/auth.guard';

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
        transactionName: tag.transaction_type,
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

  @Mutation((returns) => Transaction, { name: 'setNewPassword' })
  async setNewPassword(
    @Args('setNewPasswordInput') password: SetNewPasswordInput,
    @UserId() userId,
  ) {
    await this.usersService.setNewPassword(userId, password.password);
    return '0';
  }

  @Public()
  @Mutation((returns) => Transaction, { name: 'signUp' })
  async signUp(@Args('signUpInput') password: SignUpInput) {
    return await this.usersService.createUser(password);
  }
}
