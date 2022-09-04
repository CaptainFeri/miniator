import { BadRequestException, Controller } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AdminsService from './admins.service';
import PaginationUtils from '@utils/pagination.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateAdminDto from './dto/create-admin.dto';
import AdminEntity from '@entities/admin.entity';
import { GrpcMethod } from '@nestjs/microservices';
import UpdateAdminDto from '@/admin/dto/update-admin.dto';

@Controller()
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('AdminService', 'Create')
  async create(body: CreateAdminDto): Promise<any> {
    return await this.adminsService.create(body);
  }

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

    console.log(paginatedAdmins);

    return {
      admins: paginatedAdmins.paginatedResult,
      totalCount: paginatedAdmins.totalCount,
    };
  }

  @GrpcMethod('AdminService', 'Update')
  @Types(TypesEnum.superAdmin)
  async update(body: UpdateAdminDto): Promise<any> {
    await this.adminsService.update(body.id, body);
    return {
      success: true,
    };
  }
}
