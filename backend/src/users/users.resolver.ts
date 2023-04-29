import { User } from '@common/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user-id.decorator';
import { UsersService } from '../db/users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  async user(@UserId() userId): Promise<User> {
    const transactions = await this.usersService.getById(userId);
    return { ...transactions, mainCurrency: transactions.main_currency };
  }
}
