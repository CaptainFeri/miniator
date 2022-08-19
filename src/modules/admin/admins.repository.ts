import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import UpdateAdminDto from './dto/update-admin.dto';
import AdminEntity from './schemas/admin.entity';
import CreateAdminDto from './dto/create-admin.dto';
import { TypesEnum } from '@decorators/types.decorator';

@Injectable()
export default class AdminsRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminsModel: Repository<AdminEntity>,
  ) {}

  public create(admin: CreateAdminDto): Promise<AdminEntity> {
    return this.adminsModel.save({
      ...admin,
    });
  }

  public async getById(id: string): Promise<AdminEntity | undefined> {
    return this.adminsModel.findOne(id);
  }

  public updateById(id: string, data: UpdateAdminDto): Promise<UpdateResult> {
    return this.adminsModel.update(id, data);
  }

  public async getAllWithPagination(options: PaginationParamsInterface): Promise<PaginatedEntityInterface<AdminEntity>> {
    const [questions, totalCount] = await Promise.all([
      this.adminsModel.find({
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.adminsModel.count(),
    ]);

    return {
      paginatedResult: questions,
      totalCount,
    };
  }

  async login(email: string, password: string) {
    const user = await this.adminsModel.findOne({
      where: [
        {
          email,
        },
      ],
    });
    if (user) {
      if (user.password === password) {
        return { status: true, username: user.username, id: user.id, type: TypesEnum.admin };
      }
      return { status: false, message: 'Wrong password' };
    }
    return { status: false, message: 'User not found' }
  }
}
