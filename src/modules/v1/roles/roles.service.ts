import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import RolesRepository from './roles.repository';
import CompanyRoleEntity from '@v1/company/schemas/companyRole.entity';
import CreateRoleDto from '@v1/roles/dto/create-role.dto';
import UpdateRoleDto from '@v1/roles/dto/update-role.dto';

@Injectable()
export default class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  public async create(role: CreateRoleDto): Promise<CompanyRoleEntity> {
    return this.rolesRepository.create({
      ...role,
    });
  }

  public async getById(id: number): Promise<CompanyRoleEntity | undefined> {
    return this.rolesRepository.getById(id);
  }

  update(id: number, data: UpdateRoleDto): Promise<UpdateResult> {
    return this.rolesRepository.updateById(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyRoleEntity>> {
    return this.rolesRepository.getAllWithPagination(options);
  }
}
