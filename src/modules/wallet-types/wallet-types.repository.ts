import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import { UpdateWalletTypeDto } from './dto/update-wallet-type.dto';
import { CreateWalletTypeDto } from './dto/create-wallet-type.dto';
import { WalletTypeEntity } from '@entities/wallet-type.entity';

@Injectable()
export class WalletTypesRepository {
  constructor(
    @InjectRepository(WalletTypeEntity)
    private readonly walletsModel: Repository<WalletTypeEntity>,
  ) {}

  public create(wallet: CreateWalletTypeDto): Promise<WalletTypeEntity> {
    return this.walletsModel.save({
      ...wallet,
    });
  }

  public async getById(id: string): Promise<WalletTypeEntity | undefined> {
    return this.walletsModel.findOne(id);
  }

  public updateById(
    id: string,
    data: UpdateWalletTypeDto,
  ): Promise<UpdateResult> {
    console.log(data.name);
    return this.walletsModel.update(id, {
      name: data.name,
    });
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletTypeEntity>> {
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

  public async getAll(): Promise<WalletTypeEntity[]> {
    return this.walletsModel.find();
  }
}
