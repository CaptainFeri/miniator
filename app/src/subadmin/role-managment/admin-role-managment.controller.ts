import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { AdminService } from '../admin.service';
import { SubadminAuthGuard } from '../auth/Guard/subadmin.guard';
import { SubAdminExpressRequest } from '../auth/types/subadminExpressRequest';
import { AssignRoleServiceDto } from '../dto/assign-role-service.dto';

@Controller('admin')
@ApiTags('admin-role-managment')
export class AdminRoleManagmentController {
  constructor(private readonly adminService: AdminService) {}

  @Get('role')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async getAllRoles(
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    const roles = await this.adminService.getAllRoles(take, skip);
    return {
      data: roles,
    };
  }

  @Post('new')
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

  @Post('role/:id')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async updateRole(@Body() data: CreateRoleDto, @Param('id') id: number) {
    const role = await this.adminService.updateRole(data, id);
    return {
      data: role,
    };
  }
}
