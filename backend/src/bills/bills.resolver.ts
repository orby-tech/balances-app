import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AddBillInput,
  Bill,
  BillType,
  Currency,
  DeleteBillInput,
} from '@common/graphql';
import { UsersService } from 'src/users/users.service';

@Resolver((of) => Bill)
export class BillsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Bill)
  async bills(): Promise<Bill[]> {
    const user = await this.usersService.getBillsById(
      '123e4567-e89b-12d3-a456-426614174000',
    );

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
  async addBill(@Args('addBillInput') user: AddBillInput) {
    console.log(
      28,
      await this.usersService.setBillById(
        '123e4567-e89b-12d3-a456-426614174000',
        user,
      ),
    );
    return {
      id: '0',
    };
  }

  @Mutation((returns) => Bill, { name: 'deleteBill' })
  async deleteBill(@Args('deleteBillInput') bill: DeleteBillInput) {
    console.log('deleteBill')
    await this.usersService.deleteBillById(
      '123e4567-e89-12d3-a456-426614174000',
      bill.id,
    );
    return ''
  }
}
