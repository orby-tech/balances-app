import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddBalanceInput,
  AddTransactionInput,
  BalanceType,
  DeleteTransactionInput,
  RoleOrganisationType,
  SignUpInput,
  Transaction,
  TransactionType,
} from '@common/graphql';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Balance,
  Currency,
  Organization,
  OrganizationBalances,
  Tag,
  Transactions,
  TransactionTags,
  User,
  UserBalances,
  UserCurrencies,
  UserOrganisation,
  UserTag,
} from './entities/user/user.entity';
import { sha256 } from 'js-sha256';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(UserTag)
    private readonly userTagRepository: Repository<UserTag>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(UserCurrencies)
    private readonly userCurrencyRepository: Repository<UserCurrencies>,
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @InjectRepository(UserBalances)
    private readonly userBalanceRepository: Repository<UserBalances>,
    @InjectRepository(OrganizationBalances)
    private readonly organizationBalanceRepository: Repository<OrganizationBalances>,
    @InjectRepository(UserOrganisation)
    private readonly userOrganisationRepository: Repository<UserOrganisation>,
    @InjectRepository(Organization)
    private readonly organisationRepository: Repository<Organization>,

    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,

    @InjectRepository(TransactionTags)
    private readonly transactionTagsRepository: Repository<TransactionTags>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email: username },
    });
    return user;
  }

  getById(userId: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async setNewPassword(id: string, password: string): Promise<void> {
    await this.userRepository.update(
      { user_id: id },
      { password_hash: sha256(password) },
    );
  }

  async createUser(password: SignUpInput): Promise<string> {
    const defaultCurrency = '00000000-0000-0000-0000-000000000000';

    const userId = uuidv4();
    const result = await this.userRepository.insert({
      user_id: userId,
      email: password.email,
      main_currency: defaultCurrency,
      username: password.username,
      password_hash: sha256(password.password),
      date_created: new Date(), // TODO: problem with time zones
    });

    const balance = await this.setBalanceById(userId, {
      title: 'Example Title',
      host: 'Example Host',
      type: BalanceType.CARD,
      currencyId: defaultCurrency,
      value: 0,
    });

    await this.setTransactionById(userId, {
      type: TransactionType.RECEIVE,
      to: balance.balance_id,
      toValue: 10,
      toCurrency: defaultCurrency,
      provider: 'Example Provider',
      tags: [],
    });

    await this.setTransactionById(userId, {
      type: TransactionType.SEND,
      from: balance.balance_id,
      fromValue: 10,
      fromCurrency: defaultCurrency,
      provider: 'Example Provider',
      tags: [],
    });

    const organizationId = await this.addOrganization(userId, 'Family');

    const organizationBalance = await this.setBalanceById(userId, {
      organizationId,
      title: 'Example Title',
      host: 'Example Host',
      type: BalanceType.CARD,
      currencyId: defaultCurrency,
      value: 0,
    });

    await this.setTransactionById(userId, {
      type: TransactionType.RECEIVE,
      to: organizationBalance.balance_id,
      toValue: 10,
      toCurrency: defaultCurrency,
      provider: 'Example Provider',
      tags: [],
    });

    await this.setTransactionById(userId, {
      type: TransactionType.SEND,
      from: organizationBalance.balance_id,
      fromValue: 10,
      fromCurrency: defaultCurrency,
      provider: 'Example Provider',
      tags: [],
    });

    return 'ok';
  }

  async setMainCurrency(id: string, currencyId: string): Promise<void> {
    await this.userRepository.update(
      { user_id: id },
      { main_currency: currencyId },
    );
  }

  async getTagsById(id: string): Promise<Tag[]> {
    const tags = await this.userTagRepository.find({ where: { user_id: id } });
    if (!tags.length) {
      return [];
    }
    return this.tagRepository.find({
      where: tags.map((tag) => ({ tag_id: tag.tag_id })),
    });
  }

  async getCurrenciesById(userId: string): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  async setBalanceById(
    userId: string,
    balance: AddBalanceInput,
  ): Promise<Balance> {
    const balanceId = uuidv4();

    await this.balanceRepository.insert({
      ...balance,
      balance_id: balanceId,
      currency_id: balance.currencyId,
    });

    if (balance.organizationId) {
      await this.organizationBalanceRepository.insert({
        id: uuidv4(),
        organization_id: balance.organizationId,
        balance_id: balanceId,
      });
    } else {
      await this.userBalanceRepository.insert({
        id: uuidv4(),
        user_id: userId,
        balance_id: balanceId,
      });
    }

    return this.balanceRepository.findOne({
      where: { balance_id: balanceId },
    });
  }

  async getBalancesById(
    userId: string,
  ): Promise<(Balance & { organization_id: string })[]> {
    const userBalances = await this.userBalanceRepository.find({
      where: { user_id: userId },
    });
    if (!userBalances.length) {
      return [];
    }

    const organizations = await this.userOrganisationRepository.find({
      where: { user_id: userId },
    });

    const organizationsBalances = (
      await Promise.all(
        organizations.map(async (o) => {
          return (
            await this.organizationBalanceRepository.find({
              where: { organization_id: o.organization_id },
            })
          ).map((ob) => {
            return {
              ...ob,
              organization_id: o.organization_id,
            };
          });
        }),
      )
    ).flat();

    const _organizationsBalances = (
      await Promise.all(
        organizationsBalances.map(async (ob) => {
          return (
            await this.balanceRepository.find({
              where: { balance_id: ob.balance_id },
            })
          ).map((balance) => {
            return {
              ...balance,
              organization_id: ob.organization_id,
            };
          });
        }),
      )
    ).flat();

    return [
      ...(
        await this.balanceRepository.find({
          where: userBalances.map((userBalance) => ({
            balance_id: userBalance.balance_id,
          })),
        })
      ).map((balance) => {
        return {
          ...balance,
          organization_id: 'userBalance',
        };
      }),
      ..._organizationsBalances,
    ];
  }

  async deleteBalanceById(userId: string, balanceId: string): Promise<void> {
    await this.userBalanceRepository.delete({ balance_id: balanceId });
    await this.balanceRepository.delete({ balance_id: balanceId });
    return;
  }

  async getOrganizationsById(userId: string): Promise<
    (Organization & {
      role: UserOrganisation['role'];
      users: { email: string; role: RoleOrganisationType }[];
    })[]
  > {
    const userOrganisations = await this.userOrganisationRepository.find({
      where: { user_id: userId },
    });
    if (!userOrganisations.length) {
      return [];
    }
    return Promise.all(
      (
        await this.organisationRepository.find({
          where: userOrganisations.map((UserOrganisation) => ({
            organization_id: UserOrganisation.organization_id,
          })),
        })
      ).map(async (x) => {
        const usersInThisOrganisation =
          await this.userOrganisationRepository.find({
            where: { organization_id: x.organization_id },
          });

        const users = (
          await this.userRepository.find({
            where: usersInThisOrganisation.map((uO) => ({
              user_id: uO.user_id,
            })),
          })
        ).map((user) => {
          return {
            email: user.email,
            role: usersInThisOrganisation.find(
              (uO) => uO.user_id === user.user_id,
            )?.role,
          };
        });

        return {
          ...x,
          role: userOrganisations.find(
            (u) => u.organization_id === x.organization_id,
          ).role,
          users,
        };
      }),
    );
  }

  async addOrganization(id: string, name: string) {
    const organizationId = uuidv4();
    await this.organisationRepository.save({
      organization_id: organizationId,
      name: name,
      date_created: new Date(), // TODO: problem with time zones
    });
    await this.userOrganisationRepository.save({
      id: uuidv4(),
      organization_id: organizationId,
      user_id: id,
      role: RoleOrganisationType.OWNER,
    });

    return organizationId;
  }

  async addUserToOrganization(
    userId: string,
    name: string,
    organizationId: string,
  ) {
    const user = (
      await this.userRepository.find({ where: { username: name } })
    )[0];
    if (!user) {
      return 'No user found';
    }

    await this.userOrganisationRepository.save({
      id: uuidv4(),
      organization_id: organizationId,
      user_id: user.user_id,
      role: RoleOrganisationType.ADMIN,
    });

    return 'ok';
  }

  async leaveOrganization(userId: string, organizationId: string) {
    this.userOrganisationRepository.delete({
      user_id: userId,
      organization_id: organizationId,
    });
  }

  async kickOutUserFromOrganization(
    userId: string,
    organizationId: string,
    usernameToKickOut: string,
  ) {
    const user = (
      await this.userRepository.find({ where: { username: usernameToKickOut } })
    )[0];
    if (!user) {
      return 'No user found';
    }

    this.userOrganisationRepository.delete({
      user_id: user.user_id,
      organization_id: organizationId,
    });
  }

  async setTransactionById(
    userId: string,
    transaction: AddTransactionInput,
  ): Promise<void> {
    if (transaction.from) {
      const transactionId = uuidv4();
      await this.transactionRepository.insert({
        type: TransactionType.SEND,
        transaction_id: transactionId,
        provider: transaction.provider,
        balance_id: transaction.from,
        from: transaction.from,
        from_value: transaction.fromValue,
        from_currency: transaction.fromCurrency,
        from_fee: transaction.fromFee,
      });

      const oldValue = await this.balanceRepository.findOne({
        where: { balance_id: transaction.from },
      });
      await this.balanceRepository.update(
        { balance_id: transaction.from },
        {
          value: +oldValue.value - +transaction.fromValue,
        },
      );

      await this.fillTagsForNewTransaction(transaction, userId, transactionId);
    }

    if (transaction.to) {
      const transactionId = uuidv4();
      await this.transactionRepository.insert({
        type: TransactionType.RECEIVE,
        transaction_id: transactionId,
        provider: transaction.provider,
        balance_id: transaction.to,
        to: transaction.to,
        to_value: transaction.toValue,
        to_currency: transaction.toCurrency,
        to_fee: transaction.toFee,
      });

      const oldValue = await this.balanceRepository.findOne({
        where: { balance_id: transaction.to },
      });
      await this.balanceRepository.update(
        { balance_id: transaction.to },
        {
          value: +oldValue.value + +transaction.toValue,
        },
      );

      await this.fillTagsForNewTransaction(transaction, userId, transactionId);
    }

    return;
  }

  async fillTagsForNewTransaction(
    transaction: AddTransactionInput,
    userId: string,
    transactionId: string,
  ): Promise<void[]> {
    return Promise.all(
      transaction.tags.map(async (tag) => {
        const tagId = tag.title.toLocaleLowerCase().replaceAll(' ', '_**_');
        await this.tagRepository.save({
          tag_id: tagId,
          title: tag.title,
          transaction_type: tag.transactionName,
        });

        await this.userTagRepository.save({
          id: uuidv4(),
          tag_id: tagId,
          user_id: userId,
        });
        await this.transactionTagsRepository.save({
          id: uuidv4(),
          tag_id: tagId,
          transaction_id: transactionId,
        });
      }),
    );
  }

  async deleteTransactionById(
    userId: string,
    transaction: DeleteTransactionInput,
  ): Promise<void> {
    await this.transactionTagsRepository.delete({
      transaction_id: transaction.id,
    });

    await this.transactionRepository.delete({
      transaction_id: transaction.id,
    });
    return;
  }

  async getTransactionsById(
    userId: string,
    page: string,
    organizationId: string,
  ): Promise<Transaction[]> {
    let transactions: (OrganizationBalances | UserBalances)[];
    if (organizationId) {
      transactions = await this.organizationBalanceRepository.find({
        where: { organization_id: organizationId },
      });
    } else {
      transactions = await this.userBalanceRepository.find({
        where: { user_id: userId },
      });
    }
    if (!transactions.length) {
      return [];
    }

    return Promise.all(
      (
        await this.transactionRepository.find({
          where: transactions.map((tag) => ({
            balance_id: tag.balance_id,
          })),
        })
      ).map(async (t) => {
        const transactionTags = await this.transactionTagsRepository.find({
          where: {
            transaction_id: t.transaction_id,
          },
        });
        const tags = (
          transactionTags.length
            ? await this.tagRepository.find({
                where: transactionTags.map((tag) => ({ tag_id: tag.tag_id })),
              })
            : []
        ).map((f) => ({
          transactionName: f.transaction_type,
          title: f.title,
          id: f.tag_id,
        }));
        return {
          ...t,
          id: t.transaction_id,
          to: t.to,
          from: t.from,
          toValue: t.to_value,
          fromValue: t.from_value,
          toCurrency: t.to_currency,
          fromCurrency: t.from_currency,
          toFee: t.to_fee,
          fromFee: t.from_fee,
          feeInPercents: '0',
          tags: tags,
        };
      }),
    );
  }
}
