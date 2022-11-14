import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from './auth/Guard/admin.guard';
import { SuperAdminDto } from './dto/superadminLogin.dto';
import { SuperadminService } from './superadmin.service';

@Controller('superadmin')
@ApiTags('super-admin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Post('log-in')
  async generateToken(@Body() data: SuperAdminDto) {
    const token = await this.superadminService.generateSuperAdminToken(
      data.username,
      data.password,
      1,
    );
    if (token)
      return {
        data: token,
      };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get('test')
  getHello(): string {
    return 'test';
  }
}
