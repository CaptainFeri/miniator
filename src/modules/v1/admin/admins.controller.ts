import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AdminsService from './admins.service';
import PaginationUtils from '../../../utils/pagination.utils';
import ResponseUtils from '../../../utils/response.utils';
import CreateAdminDto from '@v1/admin/dto/create-admin.dto';
import AdminEntity from '@v1/admin/schemas/admin.entity';
import UpdateAdminDto from '@v1/admin/dto/update-admin.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('')
  async create(@Body() adminDto: CreateAdminDto): Promise<any> {
    const admin = await this.adminsService.create(adminDto);

    return ResponseUtils.success('admins', {
      message: 'Success',
      admin,
    });
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async getAll(@Query() query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedAdmins: PaginatedEntityInterface<AdminEntity> =
      await this.adminsService.getAllWithPagination(paginationParams);

    return ResponseUtils.success('admins', paginatedAdmins.paginatedResult, {
      location: 'admins',
      paginationParams,
      totalCount: paginatedAdmins.totalCount,
    });
  }

  @Post(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() admin: UpdateAdminDto,
  ): Promise<any> {
    await this.adminsService.update(id, admin);

    return ResponseUtils.success('admins', {
      message: 'Success!',
    });
  }
}
