import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/userRole.enum';
import { AdminAuthGuard } from './auth/Guard/admin.guard';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { SuperAdminDto } from './dto/superadminLogin.dto';
import { SuperadminService } from './superadmin.service';

@Controller('superadmin')
@ApiTags('super-admin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Post('admin-register')
  async createAdmin(@Body() data: CreateAdminDto) {
    const newAdmin = await this.superadminService.createNewAdmin(data);
    if (newAdmin)
      return {
        data: newAdmin,
      };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Post('create-service')
  async createService() {}

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Post('assign-admin-service')
  async assignAdminToService() {}

  @Post('log-in')
  async generateToken(@Body() data: SuperAdminDto) {
    const token = await this.superadminService.generateSuperAdminToken(
      data.username,
      data.password,
      UserRole.SUPERADMIN,
    );
    if (token)
      return {
        data: token,
      };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get('all-services')
  async getAllServices() {}

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get('admins')
  async getAllAdmins(
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    const admins = await this.superadminService.getAdmins(take, skip);
    return {
      data: admins,
    };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get('test')
  getHello() {
    return {
      data: 'test',
    };
  }
}
