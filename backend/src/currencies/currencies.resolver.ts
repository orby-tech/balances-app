import { Query, Resolver } from '@nestjs/graphql';
import { Currency } from '@common/graphql';
import { UsersService } from 'src/users/users.service';

@Resolver((of) => Currency)
export class CurrenciesResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Currency)
  async currencies(): Promise<Currency[]> {
    const user = await this.usersService.getCurrenciesById(
      '123e4567-e89b-12d3-a456-426614174000',
    );
    return user.map((currency) => ({
      id: currency.currency_id,
      title: currency.title,
      shortTitle: currency.international_short_name + currency.international_simbol,
      internationalShortName: currency.international_short_name,
      internationalSimbol: currency.international_simbol,
      valueRelatedMain: '0',
    }));
  }
}
