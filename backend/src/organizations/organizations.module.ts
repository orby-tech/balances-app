import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [OrganizationsResolver, OrganizationsService],
  imports: [DbModule]
})
export class OrganizationsModule {}
