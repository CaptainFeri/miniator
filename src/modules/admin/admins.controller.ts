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
  Put,
} from '@nestjs/common';
import JwtAccessGuard from 'src/shared/guards/jwt-access.guard';
import WrapResponseInterceptor from 'src/shared/interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import AdminsService from './admins.service';
import ResponseUtils from 'src/shared/utils/response.utils';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import { Types, TypesEnum } from 'src/shared/decorators/types.decorator';
import Serialize from 'src/shared/decorators/serialization.decorator';
import CreateAdminDto from './dto/create-admin.dto';
import { AllAdminsResponseEntity } from './entities/admin-response.entity';
import AdminEntity from '@entities/admin.entity';
import UpdateAdminDto from './dto/update-admin.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

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

  @Put(':id')
  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() admin: UpdateAdminDto): Promise<any> {
    await this.adminsService.update(id, admin);

    return ResponseUtils.success('admins', {
      message: 'Success!',
    });
  }
}
