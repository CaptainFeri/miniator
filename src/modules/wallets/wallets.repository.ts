import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import UpdateWalletDto from './dto/update-wallet.dto';
import WalletEntity from './schemas/wallet.entity';
import CreateWalletDto from './dto/create-wallet.dto';

@Injectable()
export default class WalletsRepository {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsModel: Repository<WalletEntity>,
  ) {}

  public create(wallet: CreateWalletDto): Promise<WalletEntity> {
    return this.walletsModel.save({
      ...wallet,
    });
  }

  public async getById(id: string): Promise<WalletEntity | undefined> {
    return this.walletsModel.findOne(id);
  }

  public updateById(id: string, data: UpdateWalletDto): Promise<UpdateResult> {
    return this.walletsModel.update(id, data);
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
