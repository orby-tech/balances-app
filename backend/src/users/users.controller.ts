import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    findAll() {
      return this.userService.findAll();
    }

    @Post()
    add() {
      return this.userService.add()
    }
}
