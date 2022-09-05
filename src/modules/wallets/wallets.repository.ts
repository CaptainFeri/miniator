import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import { WalletEntity } from '@entities/wallet.entity';
import { AccountEntity } from '@entities/account.entity';
import { WalletTypeEntity } from '@entities/wallet-type.entity';
import { CompanyRoleEntity } from '@entities/company-role.entity';

@Injectable()
export class WalletsRepository {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsModel: Repository<WalletEntity>,
  ) {}

  public create(
    account: AccountEntity,
    type: WalletTypeEntity,
    role: CompanyRoleEntity,
  ): Promise<WalletEntity> {
    return this.walletsModel.save({
      account,
      type,
      role,
    });
  }

  public async getById(id: string): Promise<WalletEntity | undefined> {
    return this.walletsModel.findOne(id);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletEntity>> {
    const [wallets, totalCount] = await Promise.all([
      this.walletsModel.find({
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.walletsModel.count(),
    ]);

    return {
      paginatedResult: wallets,
      totalCount,
    };
  }
}
