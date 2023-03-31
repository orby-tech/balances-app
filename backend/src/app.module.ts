import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './settings/settings.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { BillsModule } from './bills/bills.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { init1680003816406 } from './migration/1680003816406-init';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    SettingsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), '../common/graphql.ts'),
        outputAs: 'class',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'myapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrationsRun: true,

      migrationsTableName: 'migration',

      migrations: [init1680003816406],
    }),
    CurrenciesModule,
    BillsModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersModule],
  exports: [UsersModule],
})
export class AppModule {}
