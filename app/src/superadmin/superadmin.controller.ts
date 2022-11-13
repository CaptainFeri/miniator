import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './auth/Guard/admin.guard';

@Controller('superadmin')
export class SuperadminController {
  @UseGuards(AdminAuthGuard)
  @Get()
  getHello(): string {
    return 'test';
  }
}
