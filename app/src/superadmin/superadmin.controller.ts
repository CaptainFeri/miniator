import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/userRole.enum';
import { AssignAdminServiceDto } from 'src/service/dto/assign-admin-service.dto';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { AdminAuthGuard } from './auth/Guard/admin.guard';
import { CreateAdminDto } from './dto/createAdmin.dto';
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
      UserRole.SUPERADMIN,
    );
    if (token)
      return {
        data: token,
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

  //@UseGuards(AdminAuthGuard)
  // @ApiBearerAuth()
  // @Post('assign-admin-service')
  // async assignAdminToService(@Body() data: AssignAdminServiceDto) {
  //   const assign = await this.superadminService.assignAdminService(data);
  //   return {
  //     data: assign,
  //   };
  // }
}
