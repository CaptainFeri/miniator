import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { AdminsService } from './admins.service';
import PaginationUtils from '@utils/pagination.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminEntity } from '@entities/admin.entity';
import { UpdateAdminDto } from '@/admin/dto/update-admin.dto';

@Controller()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Types(TypesEnum.superAdmin)
  @MessagePattern('AdminService_Create')
  async create(@Payload() msg: any): Promise<any> {
    const body: CreateAdminDto = msg.value;
    return await this.adminsService.create(body);
  }

  @Types(TypesEnum.superAdmin)
  @MessagePattern('AdminService_GetAll')
  async getAll(@Payload() msg: any): Promise<any> {
    const query: any = msg.value;
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);

    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedAdmins: PaginatedEntityInterface<AdminEntity> =
      await this.adminsService.getAllWithPagination(paginationParams);

    return {
      admins: paginatedAdmins.paginatedResult,
      totalCount: paginatedAdmins.totalCount,
    };
  }

  @MessagePattern('AdminService_Update')
  @Types(TypesEnum.superAdmin)
  async update(@Payload() msg: any): Promise<any> {
    const body: UpdateAdminDto = msg.value;
    await this.adminsService.update(body.id, body);
    return {
      success: true,
    };
  }
}
