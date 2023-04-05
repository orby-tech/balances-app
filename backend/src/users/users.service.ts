import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddBillInput,
  AddTransactionInput,
  SignUpInput,
  Transaction,
} from '@common/graphql';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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

  async createUser(password: SignUpInput): Promise<void> {
    const defaultCurrency = '00000000-0000-0000-0000-000000000000';
    const result = await this.userRepository.insert({
      user_id: uuidv4(),
      email: password.email,
      main_currency: defaultCurrency,
      username: password.username,
      password_hash: sha256(password.password),
      date_created: new Date(), // TODO: problem with time zones
    });
  return result.raw  
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

  async setBillById(userId: string, bill: AddBillInput): Promise<Bill> {
    const billId = uuidv4();

    await this.billRepository.insert({
      ...bill,
      bill_id: billId,
      currency_id: bill.currencyId,
    });

    await this.userBillRepository.insert({
      id: uuidv4(),
      user_id: userId,
      bill_id: billId,
    });

    return this.billRepository.findOne({
      where: { bill_id: billId },
    });
  }

  async getBillsById(userId: string): Promise<Bill[]> {
    const userBalances = await this.userBillRepository.find({
      where: { user_id: userId },
    });
    if (!userBalances.length) {
      return [];
    }
    return this.billRepository.find({
      where: userBalances.map((userBalance) => ({
        bill_id: userBalance.bill_id,
      })),
    });
  }

  async deleteBillById(userId: string, billId: string): Promise<void> {
    await this.userBillRepository.delete({ bill_id: billId });
    await this.billRepository.delete({ bill_id: billId });
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
    userId: string,
    transactionId: string,
  ): Promise<void> {
    await this.userTransactionsRepository.delete({
      transaction_id: transactionId,
    });
    await this.transactionRepository.delete({
      transaction_id: transactionId,
    });
    return;
  }

  async getTransactionsById(userId: string): Promise<Transaction[]> {
    const transactions = await this.userTransactionsRepository.find({
      where: { user_id: userId },
    });
    return Promise.all(
      (
        await this.transactionRepository.find({
          where: transactions.map((tag) => ({
            transaction_id: tag.transaction_id,
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
          transactionName: f.transaction_name,
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
          fee: '0',
          feeInPercents: '0',
          tags: tags,
        };
      }),
    );
  }
}
