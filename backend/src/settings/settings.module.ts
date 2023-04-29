import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsResolver } from './settings.resolver';
import { UsersModule } from 'src/users/users.module';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, SettingsResolver],
  imports: [DbModule],
})
export class SettingsModule {}
