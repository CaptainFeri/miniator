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
import { CreateServiceDto } from '../../service/dto/create-service.dto';
import { AdminAuthGuard } from '../auth/Guard/admin.guard';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { SuperadminService } from '../superadmin.service';

@Controller('super-admin/service')
@ApiTags('super-admin_service-managment')
export class SuperAdminServiceManagmentController {
  constructor(private readonly superadminService: SuperadminService) {}

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Post('new')
  async createService(@Body() data: CreateServiceDto) {
    const newService = await this.superadminService.createNewService(data);
    return {
      data: newService,
    };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAllServices(
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    const services = await this.superadminService.getServices(take, skip);
    return {
      data: services,
    };
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async updateService(@Param('id') id: number, @Body() data: UpdateServiceDto) {
    const service = await this.superadminService.updateService(id, data);
    return {
      data: service,
    };
  }
}
