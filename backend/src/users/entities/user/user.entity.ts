import { TransactionType } from '@common/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryColumn()
  tag_id: string;

  @Column()
  transaction_name: string;

  @Column()
  title: string;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  user_id: string;

  @Column()
  main_currency: string;
}

@Entity({ name: 'transactions' })
export class Transactions {
  @PrimaryColumn()
  transaction_id: string;

  @Column()
  type: TransactionType;

  @Column()
  from: string;

  @Column()
  from_value: string;

  @Column()
  from_currency: string;

  @Column()
  to: string;

  @Column()
  to_value: string;

  @Column()
  to_currency: string;

  @Column()
  provider: string;
}

@Entity({ name: 'user_tags' })
export class UserTag {
  @PrimaryColumn()
  user_id: string;

  @Column()
  tag_id: string;
}

@Entity({ name: 'bills' })
export class Bill {
  @PrimaryColumn()
  bill_id: string;

  @Column()
  title: string;

  @Column()
  host: string;

  @Column()
  type: string;

  @Column()
  value: number;

  @Column()
  currency_id: string;
}

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryColumn()
  currency_id: string;

  @Column()
  title: string;

  @Column()
  international_short_name: string;

  @Column()
  international_simbol: string;
}

@Entity({ name: 'user_currencies' })
export class UserCurrencies {
  @PrimaryColumn()
  user_id: string;

  @Column()
  currency_id: string;
}

@Entity({ name: 'user_bills' })
export class UserBills {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  bill_id: string;
}

@Entity({ name: 'user_transactions' })
export class UserTransactions {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  transaction_id: string;
}

@Entity({ name: 'transaction_tags' })
export class TransactionTags {
  @PrimaryColumn()
  transaction_id: string;

  @Column()
  tag_id: string;
}
