import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CompanyRoleEntity } from '@entities/company-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { AccountEntity } from '@entities/account.entity';
import { WalletsService } from '@/wallets/wallets.service';
import { AccountsRepository } from '@/account/accounts.repository';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(CompanyRoleEntity)
    private readonly rolesModel: Repository<CompanyRoleEntity>,
    private readonly walletsService: WalletsService,
    @Inject(forwardRef(() => AccountsRepository))
    private readonly accountsRepository: AccountsRepository,
  ) {}

  public async create(roleDto: CreateRoleDto): Promise<CompanyRoleEntity> {
    const role = await this.rolesModel.save({
      ...roleDto,
    });
    if (!role.isSpecial) {
      this.accountsRepository
        .getAllVerified()
        .then((accounts) =>
          accounts.forEach((account) => this.addRoleToUser(role, account)),
        );
    }
    return role;
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

  public async addCommonRolesToUser(account: AccountEntity) {
    const roles = await this.rolesModel.find({ isSpecial: false });
    return Promise.all(roles.map((role) => this.addRoleToUser(role, account)));
  }

  async addRoleToUser(role: CompanyRoleEntity, account: AccountEntity) {
    await this.rolesModel
      .createQueryBuilder()
      .relation('accounts')
      .of(role)
      .add(account);
    await this.walletsService.addRoleWallets(account, role);
  }
}
