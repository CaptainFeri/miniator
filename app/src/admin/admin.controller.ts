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
import { ApiBearerAuth, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/userRole.enum';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { createSecurityQuestionDto } from 'src/security-q/dto/security-question.dto';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { SuperAdminDto } from 'src/superadmin/dto/superadminLogin.dto';
import { AdminService } from './admin.service';
import { SubadminAuthGuard } from './auth/Guard/subadmin.guard';
import { SubAdminAuthMiddleware } from './auth/middleware/sub-admin.middleware';
import { SubAdminExpressRequest } from './auth/types/subadminExpressRequest';
import { AssignRoleServiceDto } from './dto/assign-role-service.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('security-questions')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async getQuestions() {
    const questions = await this.adminService.getQuestions();
    return {
      data: questions,
    };
  }

  @Post('create-question')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async createSecurityQuestion(@Body() data: createSecurityQuestionDto) {
    const newSecurity = await this.adminService.createSecurityQuestion(data);
    return {
      data: newSecurity,
    };
  }

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

  @Get('my-roles')
  @UseGuards(SubadminAuthGuard)
  @ApiBearerAuth()
  async getAdminRoles(@Req() req: SubAdminExpressRequest) {
    const roles = await this.adminService.getRoles(req.subadmin['username']);
    return {
      data: roles,
    };
  }

  @Get('users-of-service/:id')
  @ApiBearerAuth()
  @UseGuards(SubAdminAuthMiddleware)
  async getUsersOfService(@Param('id') id: number) {
    return {
      data: await this.adminService.getUsersOfService(id),
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
