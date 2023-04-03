import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddBillInput,
  AddTransactionInput,
  Transaction,
} from '@common/graphql';
import { DeleteResult, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';
import {
  Bill,
  Currency,
  Tag,
  Transactions,
  TransactionTags,
  User,
  UserBills,
  UserCurrencies,
  UserTag,
  UserTransactions,
} from './entities/user/user.entity';

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
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(UserBills)
    private readonly userBillRepository: Repository<UserBills>,

    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,
    @InjectRepository(UserTransactions)
    private readonly userTransactionsRepository: Repository<UserTransactions>,
    @InjectRepository(TransactionTags)
    private readonly transactionTagsRepository: Repository<TransactionTags>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { login: username } });
  }

  getById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });
  }

  async setMainCurrency(id: string, currencyId: string): Promise<void> {
    await this.userRepository.update(
      { user_id: id },
      { main_currency: currencyId },
    );
  }

  async getTagsById(id: string): Promise<Tag[]> {
    const tags = await this.userTagRepository.find({ where: { user_id: id } });
    console.log(tags);
    return this.tagRepository.find({
      where: tags.map((tag) => ({ tag_id: tag.tag_id })),
    });
  }

  async getCurrenciesById(id: string): Promise<Currency[]> {
    const currencies = await this.userCurrencyRepository.find({
      where: { user_id: id },
    });
    console.log(currencies);
    return this.currencyRepository.find();
  }

  async setBillById(id: string, bill: AddBillInput): Promise<Bill[]> {
    const billId = uuidv4();
    console.log(77, bill);
    console.log(
      78,
      await this.billRepository.insert({
        ...bill,
        bill_id: billId,
        currency_id: bill.currencyId,
      }),
    );
    console.log(
      79,
      await this.userBillRepository.insert({
        id: uuidv4(),
        user_id: id,
        bill_id: billId,
      }),
    );

    const currencies = await this.userBillRepository.find({
      where: { user_id: id },
    });
    console.log(currencies);
    return this.billRepository.find({
      where: { bill_id: billId },
    });
  }

  async getBillsById(id: string): Promise<Bill[]> {
    const currencies = await this.userBillRepository.find({
      where: { user_id: id },
    });
    return this.billRepository.find({
      where: currencies.map((tag) => ({ bill_id: tag.bill_id })),
    });
  }

  async deleteBillById(id: string, billId: string): Promise<void> {
    console.log('deleteBillById');
    console.log(116, await this.userBillRepository.delete({ bill_id: billId }));
    console.log(117, await this.billRepository.delete({ bill_id: billId }));
    return;
  }

  async setTransactionById(
    id: string,
    transaction: AddTransactionInput,
  ): Promise<void> {
    const transactionId = uuidv4();
    await this.transactionRepository.insert({
      ...transaction,
      transaction_id: transactionId,
      from_value: transaction.fromValue.toString(),
      to_value: transaction.toValue.toString(),
      from_currency: transaction.fromCurrency,
      to_currency: transaction.toCurrency,
    });

    await this.userTransactionsRepository.insert({
      id: uuidv4(),
      transaction_id: transactionId,
      user_id: id,
    });

    if (transaction.from) {
      const oldValue = await this.billRepository.findOne({
        where: { bill_id: transaction.from },
      });
      await this.billRepository.update(
        { bill_id: transaction.from },
        {
          value: +oldValue.value - +transaction.toValue,
        },
      );
    }

    if (transaction.to) {
      const oldValue = await this.billRepository.findOne({
        where: { bill_id: transaction.to },
      });
      await this.billRepository.update(
        { bill_id: transaction.to },
        {
          value: +oldValue.value + +transaction.toValue,
        },
      );
    }

    return;
  }

  async deleteTransactionById(
    id: string,
    transactionId: string,
  ): Promise<void> {
    console.log('deleteBillById');
    console.log(
      117,
      await this.userTransactionsRepository.delete({
        transaction_id: transactionId,
      }),
    );
    console.log(
      116,
      await this.transactionRepository.delete({
        transaction_id: transactionId,
      }),
    );
    return;
  }

  async getTransactionsById(id: string): Promise<Transaction[]> {
    const currencies = await this.userTransactionsRepository.find({
      where: { user_id: id },
    });
    console.log(currencies);
    return Promise.all(
      (
        await this.transactionRepository.find({
          where: currencies.map((tag) => ({
            transaction_id: tag.transaction_id,
          })),
        })
      ).map(async (t) => {
        const tags = await this.transactionTagsRepository.find({
          where: {
            transaction_id: t.transaction_id,
          },
        });

        return {
          ...t,
          id: t.transaction_id,
          to: t.to,
          from: t.from,
          toValue: t.to_value,
          fromValue: t.from_value,
          toCurrency: t.to_currency,
          fromCurrency: t.from_currency,
          fee: '0',
          feeInPercents: '0',
          tags: (
            await this.tagRepository.find({
              where: tags.map((tag) => ({ tag_id: tag.tag_id })),
            })
          ).map((f) => ({
            transactionName: f.transaction_name,
            title: f.title,
            id: f.tag_id,
          })),
        };
      }),
    );
  }

  add() {
    this.userRepository.save({
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      main_currency: '123e4567-e89b-12d3-a456-426614174000',
    });
  }
}
