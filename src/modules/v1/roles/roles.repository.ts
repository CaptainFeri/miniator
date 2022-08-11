import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import UpdateRoleDto from './dto/update-role.dto';
import CompanyRoleEntity from '@v1/company/schemas/companyRole.entity';
import CreateRoleDto from '@v1/roles/dto/create-role.dto';

@Injectable()
export default class RolesRepository {
  constructor(
    @InjectRepository(CompanyRoleEntity)
    private readonly rolesModel: Repository<CompanyRoleEntity>,
  ) {}

  public create(role: CreateRoleDto): Promise<CompanyRoleEntity> {
    return this.rolesModel.save({
      ...role,
    });
  }

  public async getById(id: string): Promise<CompanyRoleEntity | undefined> {
    return this.rolesModel.findOne(id);
  }

  public updateById(id: string, data: UpdateRoleDto): Promise<UpdateResult> {
    return this.rolesModel.update(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyRoleEntity>> {
    const [questions, totalCount] = await Promise.all([
      this.rolesModel.find({
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.rolesModel.count(),
    ]);

    return {
      paginatedResult: questions,
      totalCount,
    };
  }
}
