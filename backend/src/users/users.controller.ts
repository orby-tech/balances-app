import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../db/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
