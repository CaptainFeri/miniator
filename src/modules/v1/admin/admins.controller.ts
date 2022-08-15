import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { Types, TypesEnum } from '@decorators/types.decorator';
import Serialize from '@decorators/serialization.decorator';
import { AllAdminsResponseEntity } from '@v1/admin/entities/admin-response.entity';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @Types(TypesEnum.superAdmin)
  async create(@Body() adminDto: CreateAdminDto): Promise<any> {
    await this.adminsService.create(adminDto);

    return ResponseUtils.success('admins', {
      message: 'Success',
    });
  }

  @Serialize(AllAdminsResponseEntity)
  @Get()
  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
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
  @Types(TypesEnum.superAdmin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() admin: UpdateAdminDto,
  ): Promise<any> {
    await this.adminsService.update(id, admin);

    return ResponseUtils.success('admins', {
      message: 'Success!',
    });
  }
}
