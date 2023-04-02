import { Controller, Get, Next } from '@nestjs/common';
import { NextFunction } from 'express';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  @Public()
  check(@Next() next: NextFunction) {
    next();
  }
}
