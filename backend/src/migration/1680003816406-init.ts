import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class init1680003816406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'date_created',
            type: 'timestamp ',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'login',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'password_hash',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'main_currency',
            type: 'uuid',
          },
        ],
      }),
    );

    queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'tag_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'transaction_name',
            type: 'text',
          },
          {
            name: 'title',
            type: 'text',
          },
        ],
      }),
    );

    queryRunner.createTable(
      new Table({
        name: 'currencies',
        columns: [
          {
            name: 'currency_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'title',
            type: 'text',
          },
          {
            name: 'international_short_name',
            type: 'text',
          },
          {
            name: 'international_simbol',
            type: 'text',
          },
        ],
      }),
    );

    queryRunner.createTable(
      new Table({
        name: 'bills',
        columns: [
          {
            name: 'bill_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'title',
            type: 'text',
          },
          {
            name: 'host',
            type: 'text',
          },
          {
            name: 'value',
            type: 'float',
          },
          {
            name: 'currency_id',
            type: 'text',
          },
          {
            name: 'type',
            type: 'text',
            enum: ['card'],
          },
        ],
      }),
    );

    queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'transaction_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'type',
            type: 'text',
            enum: ['RECEIVE', 'SEND', 'TRANSFER'],
          },
          {
            name: 'from',
            type: 'text',

            isNullable: true,
          },
          {
            name: 'from_value',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'from_currency',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'to',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'to_value',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'to_currency',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'text',
          },
        ],
      }),
    );

    queryRunner.query(`
    CREATE TABLE user_tags (
        user_id uuid NOT NULL REFERENCES users(user_id),
        tag_id uuid NOT NULL REFERENCES tags(tag_id),
        PRIMARY KEY(user_id, tag_id)
      );
      `);

    queryRunner.query(`
      CREATE TABLE user_transactions (
          id uuid NOT NULL,
          user_id uuid NOT NULL REFERENCES users(user_id),
          transaction_id uuid NOT NULL REFERENCES transactions(transaction_id),
          PRIMARY KEY(user_id, transaction_id)
        );
        `);

    queryRunner.query(`
        CREATE TABLE transaction_tags (
            transaction_id uuid NOT NULL REFERENCES "transactions"(transaction_id),
            tag_id uuid NOT NULL REFERENCES tags(tag_id),
            PRIMARY KEY(transaction_id, tag_id)
          );
          `);

    queryRunner.query(`
    CREATE TABLE user_currencies (
        user_id uuid NOT NULL REFERENCES users(user_id),
        currency_id uuid NOT NULL REFERENCES currencies(currency_id),
        PRIMARY KEY(user_id, currency_id)
      );
      `);

    queryRunner.query(`
      CREATE TABLE user_bills (
          id uuid NOT NULL,
          user_id uuid NOT NULL REFERENCES users(user_id),
          bill_id uuid NOT NULL REFERENCES bills(bill_id),
          PRIMARY KEY(id)
        );
        `);

    queryRunner.query(`
        Insert into "users" ("user_id", "main_currency") VALUES ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001');
       
        Insert into "tags" ("tag_id", "transaction_name", "title") VALUES ('123e4567-e89b-12d3-a456-426614174002', 'transaction_name_', 'title');
        Insert into "user_tags" ("user_id", "tag_id") VALUES ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002');
        
        
        Insert into "bills" ("bill_id", "title", "host", "type", "value", "currency_id") VALUES ('123e4567-e89b-12d3-a456-426614174004', 'title_', 'short_title_', 'CARD', '10', '123e4567-e89b-12d3-a456-426614174003');
        Insert into "user_bills" ("id", "user_id", "bill_id") VALUES ('123e4567-e89b-12d3-a456-426614175000', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174004');

        Insert into transactions ("transaction_id", "type", "provider") VALUES ('123e4567-e89b-12d3-a456-426614174005', 'TRANSFER', 'provider_');
        Insert into "user_transactions" ("id", "user_id", "transaction_id") VALUES ('123e4567-e89b-12d3-a456-426614175000', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174005');
        Insert into "transaction_tags" ("tag_id", "transaction_id") VALUES ('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174005');


        Insert into "currencies" ("currency_id", "title", "international_short_name", "international_simbol") VALUES ('00000000-0000-0000-0000-000000000000', 'US Dollar', 'USD', '$');
        Insert into "currencies" ("currency_id", "title", "international_short_name", "international_simbol") VALUES ('00000000-0000-0000-0000-000000000001', 'Russian Ruble', 'RUB', '₽');
        Insert into "user_currencies" ("user_id", "currency_id") VALUES ('123e4567-e89b-12d3-a456-426614174000', '00000000-0000-0000-0000-000000000000');

        `);

        
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
