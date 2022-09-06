import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import { CompanyRoleRequestEntity } from '@entities/company-role-request.entity';
import { CompanyRoleEntity } from '@entities/company-role.entity';
import { RolesRepository } from '@/roles/roles.repository';

@Injectable()
export class RoleRequestsRepository {
  constructor(
    @InjectRepository(CompanyRoleRequestEntity)
    private readonly roleRequestsModel: Repository<CompanyRoleRequestEntity>,
    private readonly rolesRepository: RolesRepository,
  ) {}

  public async create(
    roleId: string,
    userId: string,
  ): Promise<CompanyRoleRequestEntity> {
    const role = await this.roleRequestsModel.findOne(roleId, {
      relations: ['companyRoleEntity'],
    });
    if (!role.companyRole?.isSpecial) {
      throw new Error('role is not special');
    }
    return this.roleRequestsModel.save({
      account: { id: userId },
      companyRole: { id: roleId },
    });
  }

  public async getById(
    id: string,
  ): Promise<CompanyRoleRequestEntity | undefined> {
    return this.roleRequestsModel.findOne(id);
  }

  public async getRoleById(id: string): Promise<CompanyRoleEntity | undefined> {
    const req = await this.roleRequestsModel.findOne(id, {
      relations: ['companyRole'],
    });
    return this.rolesRepository.getByIdWithCompany(req.companyRole.id);
  }

  public async getByUserId(
    userId: string,
  ): Promise<CompanyRoleRequestEntity | undefined> {
    return this.roleRequestsModel.findOne({
      where: { account: { id: userId } },
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
