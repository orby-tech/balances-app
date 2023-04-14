import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';

@Module({
  providers: [OrganizationsResolver, OrganizationsService],
  imports: [UsersModule]
})
export class OrganizationsModule {}
