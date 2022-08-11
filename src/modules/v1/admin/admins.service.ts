import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AdminsRepository from './admins.repository';
import AdminEntity from './schemas/admin.entity';
import UpdateAdminDto from './dto/update-admin.dto';
import CreateAdminDto from '@v1/admin/dto/create-admin.dto';

@Injectable()
export default class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  public async create(admin: CreateAdminDto): Promise<AdminEntity> {
    return this.adminsRepository.create({
      ...admin,
    });
  }

  public async getById(id: number): Promise<AdminEntity | undefined> {
    return this.adminsRepository.getById(id);
  }

  update(id: number, data: UpdateAdminDto): Promise<UpdateResult> {
    return this.adminsRepository.updateById(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<AdminEntity>> {
    return this.adminsRepository.getAllWithPagination(options);
  }
}
