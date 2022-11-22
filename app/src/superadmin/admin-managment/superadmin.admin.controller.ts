import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/Guard/admin.guard';
import { CreateAdminDto } from '../dto/createAdmin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { SuperadminService } from '../superadmin.service';

@Controller('superadmin/admins')
@ApiTags('super-admin_admin-managment')
export class SuperadminAdminManagmenController {
  constructor(private readonly superadminService: SuperadminService) {}

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get()
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
  @Post('new')
  async createAdmin(@Body() data: CreateAdminDto) {
    const newAdmin = await this.superadminService.createNewAdmin(data);
    if (newAdmin)
      return {
        data: newAdmin,
      };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async updateAdmin(@Param('id') id: number, @Body() data: UpdateAdminDto) {
    const admin = await this.superadminService.updateAdmin(id, data);
    return {
      data: admin,
    };
  }
}
