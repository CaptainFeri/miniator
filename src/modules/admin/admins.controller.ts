import {
  Controller,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AdminsService from './admins.service';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateAdminDto from './dto/create-admin.dto';
import AdminEntity from '@entities/admin.entity';
import { GrpcMethod } from '@nestjs/microservices';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('AdminService', 'Create')
  async create(body: CreateAdminDto): Promise<any> {
    // async create(@Body() adminDto: CreateAdminDto): Promise<any> {
    await this.adminsService.create(body);

    return ResponseUtils.success('admins', {
      message: 'Success',
    });
  }

  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  @GrpcMethod('AdminService', 'GetAll')
  async getAll(query: any): Promise<any> {
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

  @GrpcMethod('AdminService', 'Update')
  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  async update(body: any): Promise<any> {
    await this.adminsService.update(body.id, body);
    return ResponseUtils.success('admins', {
      message: 'Success!',
    });
  }
}
