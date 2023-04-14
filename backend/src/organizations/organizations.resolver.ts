import {
  AddBalanceInput,
  AddOrganizationInput,
  Balance,
  BalanceType,
  Organization,
} from '@common/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user-id.decorator';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class OrganizationsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Organization)
  async organizations(@UserId() userId): Promise<Organization[]> {
    const organizations = await this.usersService.getOrganizationsById(userId);

    return organizations.map((o) => ({
      organization_id: o.organization_id,
      name: o.name,
      role: o.role,
      users: o.users.map((u) => ({ ...u, mainCurrency: u.main_currency })),
    }));
  }

  @Mutation((returns) => String, { name: 'addOrganization' })
  async addOrganization(
    @Args('addOrganizationInput') user: AddOrganizationInput,
    @UserId() userId,
  ) {
    await this.usersService.addOrganization(userId, user.name)
    return 'ok'
  }
  
}
