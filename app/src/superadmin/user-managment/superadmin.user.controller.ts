import {
  Body,
  Controller,
  Get,
  UseGuards,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/Guard/admin.guard';
import { SuperadminService } from '../superadmin.service';
import { AdminUpdateUesrDto } from './dto/admin-update-user.dto';
import { UserFilterDto } from './dto/get-user.dto';

@Controller('super-admin/users')
@ApiTags('super-admin_user-managment')
export class SuperAdminUserManagmentController {
  constructor(private readonly superadminSerivce: SuperadminService) {}

  @Patch('update/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async updateUser(@Param('id') id: number, @Body() data: AdminUpdateUesrDto) {
    const resUser = await this.superadminSerivce.updateUser(id, data);
    return {
      data: resUser,
    };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getUsers(@Query() data: UserFilterDto) {
    const users = await this.superadminSerivce.getUsers(data);
    return {
      data: users,
    };
  }
}
