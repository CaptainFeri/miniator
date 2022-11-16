import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/userRole.enum';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { SuperAdminDto } from 'src/superadmin/dto/superadminLogin.dto';
import { AdminService } from './admin.service';
import { SubadminAuthGuard } from './auth/Guard/subadmin.guard';
import { SubAdminExpressRequest } from './auth/types/subadminExpressRequest';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('services')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async getAssignedServices() {}

  @Get('roles-of-service')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async getRolesOfService() {}

  @Post('create-role')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async createRole() {}

  @Post('assign-role-service')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async assignRoleToService() {}

  @Post('user-register')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async registerUser(
    @Req() req: SubAdminExpressRequest,
    @Body() data: CreateAdminDto,
  ) {
    const newUser = await this.adminService.createUser(data, req.subadmin);
    if (newUser)
      return {
        data: newUser,
      };
  }

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
