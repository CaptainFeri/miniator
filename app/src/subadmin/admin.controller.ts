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

  // @Get('services')
  // @ApiBearerAuth()
  // @UseGuards(SubadminAuthGuard)
  // async getAssignedServices(
  //   @Req() req: SubAdminExpressRequest,
  //   @Query('take') take: number = 10,
  //   @Query('skip') skip: number = 0,
  // ) {
  //   const services = await this.adminService.getServices(
  //     req.subadmin,
  //     take,
  //     skip,
  //   );
  //   return {
  //     data: services,
  //   };
  // }

  // @Get('users-of-service/:id')
  // @ApiBearerAuth()
  // @UseGuards(SubAdminAuthMiddleware)
  // async getUsersOfService(@Param('id') id: number) {
  //   return {
  //     data: await this.adminService.getUsersOfService(id),
  //   };
  // }

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
