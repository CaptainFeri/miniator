import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import CompanyRoleRequestEntity from '@entities/company-role-request.entity';


@Injectable()
export default class RoleRequestsRepository {
  constructor(
    @InjectRepository(CompanyRoleRequestEntity)
    private readonly roleRequestsModel: Repository<CompanyRoleRequestEntity>,
  ) {}

  public async create(
    roleId: string,
    userId: string,
  ): Promise<CompanyRoleRequestEntity> {
    const role = await this.roleRequestsModel.findOne(roleId, {
      relations: ['companyRoleEntity'],
    });
    if (!role.companyRoleEntity?.requestable)
      throw new Error('role is not special');
    return this.roleRequestsModel.save({
      accountEntity: { id: userId },
      companyRoleEntity: { id: roleId },
    });
  }

  public async getById(
    id: string,
  ): Promise<CompanyRoleRequestEntity | undefined> {
    return this.roleRequestsModel.findOne(id);
  }

  public async getByUserId(
    userId: string,
  ): Promise<CompanyRoleRequestEntity | undefined> {
    return this.roleRequestsModel.findOne({
      where: { accountEntity: { id: userId } },
    });
  }

  public accept(id: string): Promise<UpdateResult> {
    return this.roleRequestsModel.update(id, { status: true });
  }

  public async getAllUnacceptedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyRoleRequestEntity>> {
    const [questions, totalCount] = await Promise.all([
      this.roleRequestsModel.find({
        where: {
          status: false,
        },
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.roleRequestsModel.count({ status: false }),
    ]);

    return {
      paginatedResult: questions,
      totalCount,
    };
  }
}