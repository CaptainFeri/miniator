import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import RolesRepository from './roles.repository';
import RoleRequestsRepository from './role-request.repository';
import CompanyRoleEntity from '../company/schemas/company-role.entity';
import CreateRoleDto from './dto/create-role.dto';
import UpdateRoleDto from './dto/update-role.dto';
import CompanyRoleRequestEntity from '../company/schemas/company-role-request.entity';



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

  accept(id: string): Promise<UpdateResult> {
    return this.roleRequestsRepository.accept(id);
  }
}
