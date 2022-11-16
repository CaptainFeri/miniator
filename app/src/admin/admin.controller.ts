import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/userRole.enum';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { SuperAdminDto } from 'src/superadmin/dto/superadminLogin.dto';
import { AdminService } from './admin.service';
import { SubadminAuthGuard } from './auth/Guard/subadmin.guard';
import { SubAdminExpressRequest } from './auth/types/subadminExpressRequest';
import { AssignRoleServiceDto } from './dto/assign-role-service.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('services')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async getAssignedServices(
    @Req() req: SubAdminExpressRequest,
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    const services = await this.adminService.getServices(
      req.subadmin,
      take,
      skip,
    );
    return {
      data: services,
    };
  }

  @Get('roles-of-service/:id')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async getRolesOfService(@Param('id') serviceId: string) {
    const roles = await this.adminService.getRolesOfService(+serviceId);
    return {
      data: roles,
    };
  }

  @Post('create-role')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async createRole(
    @Body() data: CreateRoleDto,
    @Req() req: SubAdminExpressRequest,
  ) {
    const newRole = await this.adminService.createNewRole(
      data,
      req.subadmin['username'],
    );
    return {
      data: newRole,
    };
  }

  @Post('assign-role-service')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async assignRoleToService(
    @Body() data: AssignRoleServiceDto,
    @Req() req: SubAdminExpressRequest,
  ) {
    const assign = await this.adminService.assignRoleServie(
      data,
      req.subadmin['username'],
    );
    return {
      data: assign,
    };
  }

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
