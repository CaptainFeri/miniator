import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import RolesRepository from './roles.repository';
import RoleRequestsRepository from './role-request.repository';
import CompanyRoleEntity from '@entities/company-role.entity';
import CreateRoleDto from './dto/create-role.dto';
import UpdateRoleDto from './dto/update-role.dto';
import CompanyRoleRequestEntity from '@entities/company-role-request.entity';
import AccountEntity from '@entities/account.entity';

@Injectable()
export default class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly roleRequestsRepository: RoleRequestsRepository,
  ) {}

  public async create(role: CreateRoleDto): Promise<CompanyRoleEntity> {
    return this.rolesRepository.create({
      ...role,
    });
  }

  public async getById(id: string): Promise<CompanyRoleEntity | undefined> {
    return this.rolesRepository.getById(id);
  }

  update(id: string, data: UpdateRoleDto): Promise<UpdateResult> {
    return this.rolesRepository.updateById(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyRoleEntity>> {
    return this.rolesRepository.getAllWithPagination(options);
  }

  request(
    id: string,
    userId: string,
  ): Promise<CompanyRoleRequestEntity | undefined> {
    return this.roleRequestsRepository.create(id, userId);
  }

  async accept(id: string, account: AccountEntity) {
    await this.roleRequestsRepository.accept(id);
    const role = await this.roleRequestsRepository.getRoleById(id);
    await this.rolesRepository.addRoleToUser(role, account);
  }
}
