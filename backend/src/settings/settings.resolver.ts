import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings, TransactionType } from '@common/graphql';
import { User } from 'src/users/entities/user/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

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
}
