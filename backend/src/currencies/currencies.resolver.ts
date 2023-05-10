import { Query, Resolver } from '@nestjs/graphql';
import { CurrenciesRate, Currency } from '@common/graphql';
import { UsersService } from 'src/db/users.service';
import { CurrenciesService } from './currencies.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Resolver((of) => Currency)
export class CurrenciesResolver {
  constructor(
    private readonly usersService: UsersService,
    private currenciesService: CurrenciesService,
  ) {}

  @Query((returns) => Currency)
  async currencies(@UserId() userId): Promise<Currency[]> {
    const user = await this.usersService.getCurrenciesById(userId);
    return user.map((currency) => ({
      id: currency.currency_id,
      title: currency.title,
      shortTitle:
        currency.international_short_name + currency.international_simbol,
      internationalShortName: currency.international_short_name,
      internationalSimbol: currency.international_simbol,
    }));
  }

  @Query((returns) => CurrenciesRate)
  async currenciesRate(): Promise<CurrenciesRate[]> {
    return this.currenciesService.getLatest();
  }
}
