import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserFilterDto } from 'src/superadmin/user-managment/dto/get-user.dto';
import { AdminService } from '../admin.service';
import { SubadminAuthGuard } from '../auth/Guard/subadmin.guard';

@Controller('admin/users')
@ApiTags('amin-user-managment')
export class AdminUserManagmentController {
  constructor(private readonly adminService: AdminService) {}

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
