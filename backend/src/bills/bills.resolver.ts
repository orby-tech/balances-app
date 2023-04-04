import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddBillInput, Bill, BillType, DeleteBillInput } from '@common/graphql';
import { UsersService } from 'src/users/users.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Resolver((of) => Bill)
export class BillsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Bill)
  async bills(@UserId() userId): Promise<Bill[]> {
    const user = await this.usersService.getBillsById(userId);

    return user.map((bill) => ({
      id: bill.bill_id,
      title: bill.title,
      host: bill.host,
      type: bill.type as BillType,
      value: bill.value,
      valueInMain: bill.value * 10,
      currencyId: bill.currency_id,
    }));
  }

  @Mutation((returns) => Bill, { name: 'addBill' })
  async addBill(@Args('addBillInput') user: AddBillInput, @UserId() userId) {
    return {
      id: (await this.usersService.setBillById(userId, user))?.bill_id,
    };
  }

  @Mutation((returns) => Bill, { name: 'deleteBill' })
  async deleteBill(
    @Args('deleteBillInput') bill: DeleteBillInput,
    @UserId() userId,
  ) {
    await this.usersService.deleteBillById(userId, bill.id);
    return '';
  }
}
