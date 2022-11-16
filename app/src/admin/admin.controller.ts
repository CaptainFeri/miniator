import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/userRole.enum';
import { SuperAdminDto } from 'src/superadmin/dto/superadminLogin.dto';
import { AdminService } from './admin.service';
import { SubadminAuthGuard } from './auth/Guard/subadmin.guard';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('log-in')
  async generateToken(@Body() data: SuperAdminDto) {
    const token = await this.adminService.generateSuperAdminToken(
      data.username,
      data.password,
      UserRole.ADMIN,
    );
    if (token)
      return {
        data: token,
      };
  }

  @ApiBearerAuth()
  @Get('test')
  @UseGuards(SubadminAuthGuard)
  getHello() {
    return {
      data: 'test',
    };
  }
}
