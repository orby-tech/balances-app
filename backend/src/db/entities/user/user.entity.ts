import { RoleOrganisationType, TransactionType } from '@common/graphql';
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
  transaction_type: TransactionType;

  @Column()
  title: string;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  user_id: string;

  @Column()
  main_currency: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  date_created: Date;

  @Column()
  password_hash: string;
}

@Entity({ name: 'transactions' })
export class Transactions {
  @PrimaryColumn()
  transaction_id: string;

  @Column()
  balance_id: string;

  @Column()
  type: TransactionType;

  @Column()
  from: string;

  @Column()
  from_value: number;

  @Column()
  from_currency: string;

  @Column()
  from_fee: number;

  @Column()
  to: string;

  @Column()
  to_value: number;

  @Column()
  to_currency: string;

  @Column()
  to_fee: number;

  @Column()
  provider: string;
}

@Entity({ name: 'user_tags' })
export class UserTag {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  tag_id: string;
}

export type BalanceStatus = 'ARCHIVED' | 'ACTIVE'

export const BalanceStatus = {
  ARCHIVED: 'ARCHIVED' as BalanceStatus,
  ACTIVE: 'ACTIVE' as BalanceStatus,
}

@Entity({ name: 'balances' })
export class Balance {
  @PrimaryColumn()
  balance_id: string;

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

  @Column()
  status: BalanceStatus
}

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryColumn()
  organization_id: string;

  @Column()
  name: string;

  @Column()
  date_created: Date;
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

@Entity({ name: 'user_organization' })
export class UserOrganisation {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  organization_id: string;

  @Column()
  role: RoleOrganisationType;
}

@Entity({ name: 'user_balances' })
export class UserBalances {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  balance_id: string;
}

@Entity({ name: 'organization_balances' })
export class OrganizationBalances {
  @PrimaryColumn()
  id: string;

  @Column()
  organization_id: string;

  @Column()
  balance_id: string;
}

@Entity({ name: 'transaction_tags' })
export class TransactionTags {
  @PrimaryColumn()
  id: string;

  @Column()
  transaction_id: string;

  @Column()
  tag_id: string;
}

@Entity({ name: 'chains' })
export class Chain {
  @PrimaryColumn()
  chain_id: string;

  @Column()
  subject_id: string;
}

@Entity({ name: 'chain_items' })
export class ChainItem {
  @PrimaryColumn()
  transaction_id: string;

  @Column()
  chain_id: string;
}
