
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum BalanceStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}

export enum BalanceType {
    CARD = "CARD"
}

export enum TransactionType {
    RECEIVE = "RECEIVE",
    SEND = "SEND",
    TRANSFER = "TRANSFER"
}

export enum RoleOrganisationType {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    WATCHER = "WATCHER"
}

export enum TransactionStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}

export class SetMainCurrencyInput {
    id: string;
}

export class AddOrganizationInput {
    name: string;
}

export class LeaveOrganizationInput {
    organizationId: string;
}

export class KickOutUserFromOrganizationInput {
    username: string;
    organizationId: string;
}

export class AddUserToOrganizationInput {
    name: string;
    organizationId: string;
}

export class SetNewPasswordInput {
    password: string;
}

export class SignUpInput {
    username: string;
    email: string;
    password: string;
}

export class AddTagInput {
    transactionType?: Nullable<TransactionType>;
    title?: Nullable<string>;
}

export class AddBalanceInput {
    organizationId?: Nullable<string>;
    title: string;
    host: string;
    value: number;
    currencyId: string;
    type: BalanceType;
}

export class DeleteBalanceInput {
    id: string;
}

export class AddTransactionInput {
    organizationId?: Nullable<string>;
    type: TransactionType;
    from?: Nullable<string>;
    fromValue?: Nullable<number>;
    fromCurrency?: Nullable<string>;
    fromFee?: Nullable<number>;
    fromFeeInPercents?: Nullable<number>;
    to?: Nullable<string>;
    toValue?: Nullable<number>;
    toCurrency?: Nullable<string>;
    toFee?: Nullable<number>;
    toFeeInPercents?: Nullable<number>;
    provider?: Nullable<string>;
    tags: Nullable<TagInput>[];
}

export class TagInput {
    transactionName: TransactionType;
    title: string;
    id?: Nullable<string>;
}

export class DeleteTransactionInput {
    organizationId?: Nullable<string>;
    id: string;
}

export abstract class IQuery {
    abstract user(): User | Promise<User>;

    abstract settings(): Settings | Promise<Settings>;

    abstract balances(): Nullable<Nullable<Balance>[]> | Promise<Nullable<Nullable<Balance>[]>>;

    abstract transactions(page: number, organizationId?: Nullable<string>): Nullable<Nullable<Transaction>[]> | Promise<Nullable<Nullable<Transaction>[]>>;

    abstract chains(organizationId?: Nullable<string>): Nullable<Chain>[] | Promise<Nullable<Chain>[]>;

    abstract currencies(): Nullable<Nullable<Currency>[]> | Promise<Nullable<Nullable<Currency>[]>>;

    abstract currenciesRate(): Nullable<CurrenciesRate> | Promise<Nullable<CurrenciesRate>>;

    abstract organizations(): Nullable<Nullable<Organization>[]> | Promise<Nullable<Nullable<Organization>[]>>;
}

export abstract class IMutation {
    abstract setMainCurrency(setMainCurrencyInput?: Nullable<SetMainCurrencyInput>): string | Promise<string>;

    abstract setNewPassword(setNewPasswordInput?: Nullable<SetNewPasswordInput>): string | Promise<string>;

    abstract signUp(signUpInput?: Nullable<SignUpInput>): string | Promise<string>;

    abstract addTag(addTagInput?: Nullable<AddTagInput>): string | Promise<string>;

    abstract addBalance(addBalanceInput: AddBalanceInput): Balance | Promise<Balance>;

    abstract deleteBalance(deleteBalanceInput: DeleteBalanceInput): Nullable<string> | Promise<Nullable<string>>;

    abstract addTransaction(addTransactionInput: AddTransactionInput): Nullable<string> | Promise<Nullable<string>>;

    abstract deleteTransaction(deleteTransactionInput: DeleteTransactionInput): Nullable<string> | Promise<Nullable<string>>;

    abstract addOrganization(addOrganizationInput: AddOrganizationInput): Nullable<string> | Promise<Nullable<string>>;

    abstract leaveOrganization(leaveOrganizationInput: LeaveOrganizationInput): Nullable<string> | Promise<Nullable<string>>;

    abstract kickOutUserFromOrganization(kickOutUserFromOrganizationInput: KickOutUserFromOrganizationInput): Nullable<string> | Promise<Nullable<string>>;

    abstract addUserToOrganization(addUserToOrganizationInput: AddUserToOrganizationInput): Nullable<string> | Promise<Nullable<string>>;
}

export class User {
    email: string;
    username?: Nullable<string>;
    mainCurrency: string;
}

export class Settings {
    mainCurrency: string;
    tags?: Nullable<Nullable<Tag>[]>;
}

export class Balance {
    organization_id?: Nullable<string>;
    id: string;
    title: string;
    host: string;
    value: number;
    valueInMain: number;
    currencyId: string;
    type: BalanceType;
    status: BalanceStatus;
}

export class CurrenciesRate {
    meta: CurrenciesRateMeta;
    data: Nullable<CurrenciesRateData>[];
}

export class CurrenciesRateMeta {
    last_updated_at: string;
}

export class CurrenciesRateData {
    code: string;
    value: number;
}

export class Organization {
    organization_id: string;
    name: string;
    role: RoleOrganisationType;
    users: Nullable<OrganizationUser>[];
}

export class OrganizationUser {
    email: string;
    role: RoleOrganisationType;
}

export class Transaction {
    type: TransactionType;
    id: string;
    from?: Nullable<string>;
    fromValue?: Nullable<number>;
    fromCurrency?: Nullable<string>;
    fromFee?: Nullable<number>;
    fromFeeInPercents?: Nullable<number>;
    to?: Nullable<string>;
    toValue?: Nullable<number>;
    toCurrency?: Nullable<string>;
    toFee?: Nullable<number>;
    toFeeInPercents?: Nullable<number>;
    provider?: Nullable<string>;
    tags: Nullable<Tag>[];
    status: TransactionStatus;
}

export class Chain {
    transactionId: string;
    chainId: string;
}

export class Tag {
    transactionName: string;
    title: string;
    id: string;
}

export class Currency {
    id: string;
    title: string;
    shortTitle: string;
    internationalShortName: string;
    internationalSimbol: string;
    valueRelatedMain: string;
}

type Nullable<T> = T | null;
