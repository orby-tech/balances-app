import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [UsersResolver],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
