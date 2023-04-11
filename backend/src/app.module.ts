import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './settings/settings.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { BalancesModule } from './balances/balances.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { init1680003816406 } from './migration/1680003816406-init';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    AuthModule,
    SettingsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), '../common/graphql.ts'),
        outputAs: 'class',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../frontend/dist/frontend'),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
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
    BalancesModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersModule,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UsersModule],
})
export class AppModule {}
