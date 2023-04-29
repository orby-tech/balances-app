import {
  AddOrganizationInput,
  AddUserToOrganizationInput,
  KickOutUserFromOrganizationInput,
  LeaveOrganizationInput,
  Organization,
} from '@common/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user-id.decorator';
import { UsersService } from 'src/db/users.service';

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
      users: o.users.map((u) => ({ email: u.email, role: u.role })),
    }));
  }

  @Mutation((returns) => String, { name: 'addOrganization' })
  async addOrganization(
    @Args('addOrganizationInput') user: AddOrganizationInput,
    @UserId() userId,
  ) {
    await this.usersService.addOrganization(userId, user.name);
    return 'ok';
  }

  @Mutation((returns) => String, { name: 'addUserToOrganization' })
  async addUserToOrganization(
    @Args('addUserToOrganizationInput') user: AddUserToOrganizationInput,
    @UserId() userId,
  ) {
    return await this.usersService.addUserToOrganization(
      userId,
      user.name,
      user.organizationId,
    );
  }

  @Mutation((returns) => String, { name: 'leaveOrganization' })
  async leaveOrganization(
    @Args('leaveOrganizationInput') user: LeaveOrganizationInput,
    @UserId() userId,
  ) {
    await this.usersService.leaveOrganization(userId, user.organizationId);
    return 'ok';
  }

  @Mutation((returns) => String, { name: 'kickOutUserFromOrganization' })
  async kickOutUserFromOrganization(
    @Args('kickOutUserFromOrganizationInput') user: KickOutUserFromOrganizationInput,
    @UserId() userId,
  ) {
    await this.usersService.kickOutUserFromOrganization(userId, user.organizationId, user.username);
    return 'ok';
  }
}
