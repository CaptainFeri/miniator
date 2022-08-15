import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AdminsRepository from './admins.repository';
import AdminEntity from './schemas/admin.entity';
import UpdateAdminDto from './dto/update-admin.dto';
import CreateAdminDto from '@v1/admin/dto/create-admin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export default class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  public async create(admin: CreateAdminDto): Promise<AdminEntity> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    return this.adminsRepository.create({
      ...admin,
      password: hashedPassword,
    });
  }

  public async getById(id: string): Promise<AdminEntity | undefined> {
    return this.adminsRepository.getById(id);
  }

  update(id: string, data: UpdateAdminDto): Promise<UpdateResult> {
    return this.adminsRepository.updateById(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<AdminEntity>> {
    return this.adminsRepository.getAllWithPagination(options);
  }
}
