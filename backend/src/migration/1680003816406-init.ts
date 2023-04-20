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
            type: 'timestamp',
          },
          {
            name: 'email',
            type: 'text',
          },
          {
            name: 'password_hash',
            type: 'text',
          },
          {
            name: 'username',
            type: 'text',
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
        name: 'organizations',
        columns: [
          {
            name: 'organization_id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'date_created',
            type: 'timestamp',
          },
          {
            name: 'name',
            type: 'text',
          },
        ],
      }),
    );

    queryRunner.query(`
        CREATE TYPE user_role_in_organization AS ENUM ('OWNER', 'ADMIN', 'WATCHER');
    `);

    queryRunner.createTable(
      new Table({
        name: 'user_organization',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'role',
            type: 'enum',
            enumName: 'user_role_in_organization',
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
            type: 'text',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'transaction_type',
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
        name: 'balances',
        columns: [
          {
            name: 'balance_id',
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
            name: 'balance_id',
            type: 'uuid',
          },
          {
            name: 'type',
            type: 'text',
            enum: ['RECEIVE', 'SEND'],
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
        id uuid NOT NULL PRIMARY KEY,
        user_id uuid NOT NULL REFERENCES users(user_id),
        tag_id text NOT NULL REFERENCES tags(tag_id)
      );
      `);

    queryRunner.query(`
        CREATE TABLE transaction_tags (
            id uuid NOT NULL PRIMARY KEY,
            transaction_id uuid NOT NULL REFERENCES "transactions"(transaction_id),
            tag_id text NOT NULL REFERENCES tags(tag_id)
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
      CREATE TABLE user_balances (
          id uuid NOT NULL,
          user_id uuid NOT NULL REFERENCES users(user_id),
          balance_id uuid NOT NULL REFERENCES balances(balance_id),
          PRIMARY KEY(id)
        );
        `);

    queryRunner.query(`
    CREATE TABLE organization_balances (
        id uuid NOT NULL,
        organization_id uuid NOT NULL REFERENCES organizations(organization_id),
        balance_id uuid NOT NULL REFERENCES balances(balance_id),
        PRIMARY KEY(id)
      );
      `);

    queryRunner.query(`

        
        Insert into "currencies" ("currency_id", "title", "international_short_name", "international_simbol") VALUES ('00000000-0000-0000-0000-000000000000', 'US Dollar', 'USD', '$');
        Insert into "currencies" ("currency_id", "title", "international_short_name", "international_simbol") VALUES ('00000000-0000-0000-0000-000000000001', 'Russian Ruble', 'RUB', '₽');


        Insert into "users" (
          "user_id",
          "main_currency",
          "email",
          "username",
          "password_hash",
          "date_created"
          ) VALUES (
            '123e4567-e89b-12d3-a456-426614174000',
            '00000000-0000-0000-0000-000000000000',
            'user@user.com',
            'user',
            '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86',
            (date '2017-01-01')::timestamp
            );
       
        Insert into "tags" (
          "tag_id",
          "transaction_type",
          "title") VALUES (
          '123e4567-e89b-12d3-a456-426614174002',
          'transaction_name_',
          'title'
          );
        Insert into "user_tags" ("id", "user_id", "tag_id") VALUES ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002');
                
        Insert into "balances" (
          "balance_id", 
          "title", 
          "host", 
          "type", 
          "value", 
          "currency_id"
          ) VALUES (
          '123e4567-e89b-12d3-a456-426614174004', 
          'title_', 
          'short_title_', 
          'CARD', 
          '0', 
          '00000000-0000-0000-0000-000000000000'
          );

        Insert into "user_balances" (
          "id", 
          "user_id", 
          "balance_id"
          ) VALUES (
          '123e4567-e89b-12d3-a456-426614175000', 
          '123e4567-e89b-12d3-a456-426614174000', 
          '123e4567-e89b-12d3-a456-426614174004'
          );

        Insert into transactions (
          "balance_id", 
          "transaction_id", 
          "type", 
          "provider",
          "to",
          "to_value"
          ) VALUES (
          '123e4567-e89b-12d3-a456-426614174004',
          '123e4567-e89b-12d3-a456-426614174005', 
          'RECEIVE', 
          'provider_',
          '123e4567-e89b-12d3-a456-426614174004',
          '10'
          );

          Insert into transactions (
            "balance_id", 
            "transaction_id", 
            "type", 
            "provider",
            "from",
            "from_value"
            ) VALUES (
            '123e4567-e89b-12d3-a456-426614174004',
            '123e4567-e89b-12d3-a456-426614174006', 
            'SEND', 
            'provider_',
            '123e4567-e89b-12d3-a456-426614174004',
            '10'
            );

        Insert into "transaction_tags" ("id", "tag_id", "transaction_id") VALUES ('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174005');


        Insert into "user_currencies" ("user_id", "currency_id") VALUES ('123e4567-e89b-12d3-a456-426614174000', '00000000-0000-0000-0000-000000000000');

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
