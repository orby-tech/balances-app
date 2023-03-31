import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsResolver } from './settings.resolver';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, SettingsResolver],
  imports: [UsersModule],
})
export class SettingsModule {}
