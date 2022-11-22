import { Body, Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/Guard/admin.guard';
import { SuperadminService } from '../superadmin.service';
import { UserFilterDto } from './dto/get-user.dto';

@Controller('super-admin/users')
@ApiTags('super-admin_user-managment')
export class SuperAdminUserManagmentController {
  constructor(private readonly superadminSerivce: SuperadminService) {}

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
