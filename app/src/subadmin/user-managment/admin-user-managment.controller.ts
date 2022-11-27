import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/superadmin/auth/Guard/admin.guard';
import { AdminUpdateUesrDto } from 'src/superadmin/user-managment/dto/admin-update-user.dto';
import { UserFilterDto } from 'src/superadmin/user-managment/dto/get-user.dto';
import { AdminService } from '../admin.service';
import { SubadminAuthGuard } from '../auth/Guard/subadmin.guard';

@Controller('admin/users')
@ApiTags('amin-user-managment')
export class AdminUserManagmentController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('update/:id')
  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  async updateUser(@Param('id') id: number, @Body() data: AdminUpdateUesrDto) {
    const resUser = await this.adminService.updateUser(id, data);
    return {
      data: resUser,
    };
  }

  @ApiBearerAuth()
  @UseGuards(SubadminAuthGuard)
  @Get()
  async getUsers(@Query() data: UserFilterDto) {
    const users = await this.adminService.getUsers(data);
    return {
      data: users,
    };
  }
}
