import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BillsResolver } from './bills.resolver';
import { BillsService } from './bills.service';

@Module({
  providers: [BillsResolver, BillsService],
  imports: [UsersModule],

})
export class BillsModule {}
