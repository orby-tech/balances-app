import {
  AddTransactionInput,
  DeleteTransactionInput,
  Transaction,
  TransactionType,
} from '@common/graphql';
import { Global, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Balance,
  Chain,
  ChainItem,
  OrganizationBalances,
  Tag,
  TransactionTags,
  Transactions,
  UserBalances,
  UserTag,
} from 'src/db/entities/user/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Chain)
    private readonly chainsRepository: Repository<Chain>,

    @InjectRepository(ChainItem)
    private readonly chainItemRepository: Repository<ChainItem>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(UserTag)
    private readonly userTagRepository: Repository<UserTag>,

    @InjectRepository(TransactionTags)
    private readonly transactionTagsRepository: Repository<TransactionTags>,

    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,

    @InjectRepository(UserBalances)
    private readonly userBalanceRepository: Repository<UserBalances>,

    @InjectRepository(OrganizationBalances)
    private readonly organizationBalanceRepository: Repository<OrganizationBalances>,

    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}

  async setTransactionById(
    userId: string,
    transaction: AddTransactionInput,
  ): Promise<void> {
    const fromTransactionId = uuidv4();
    if (transaction.from) {
      await this.transactionRepository.insert({
        type: TransactionType.SEND,
        transaction_id: fromTransactionId,
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

      await this.fillTagsForNewTransaction(
        transaction,
        userId,
        fromTransactionId,
      );
    }

    const toTransactionId = uuidv4();
    if (transaction.to) {
      await this.transactionRepository.insert({
        type: TransactionType.RECEIVE,
        transaction_id: toTransactionId,
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

      await this.fillTagsForNewTransaction(
        transaction,
        userId,
        toTransactionId,
      );
    }

    if (transaction.from && transaction.to) {
      const chainId = uuidv4();
      await this.chainsRepository.insert([
        {
          subject_id: transaction?.organizationId || userId,
          chain_id: chainId,
        },
      ]);

      await this.chainItemRepository.insert([
        {
          chain_id: chainId,
          transaction_id: toTransactionId,
        },
        {
          chain_id: chainId,
          transaction_id: fromTransactionId,
        },
      ]);
    }

    return;
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
          chains: await this.getChainsBySubjectId(organizationId || userId),
        };
      }),
    );
  }

  async getChainsBySubjectId(
    subjectId: string,
  ): Promise<{ chainId: string; transactionId: string }[]> {
    const subjectsChains = await this.chainsRepository.find({
      where: {
        subject_id: subjectId,
      },
    });

    if (!subjectsChains.length) {
      return [];
    }

    return (
      await this.chainItemRepository.find({
        where: subjectsChains.map((s) => ({ chain_id: s.chain_id })),
      })
    ).map((x) => ({ transactionId: x.transaction_id, chainId: x.chain_id }));
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
}
