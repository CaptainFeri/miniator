import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import WalletsRepository from './wallets.repository';
import WalletEntity from './schemas/wallet.entity';
import UpdateWalletDto from './dto/update-wallet.dto';
import CreateWalletDto from '@v1/wallets/dto/create-wallet.dto';

@Injectable()
export default class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  public async create(wallet: CreateWalletDto): Promise<WalletEntity> {
    return this.walletsRepository.create({
      ...wallet,
    });
  }

  public async getById(id: string): Promise<WalletEntity | undefined> {
    return this.walletsRepository.getById(id);
  }

  update(id: string, data: UpdateWalletDto): Promise<UpdateResult> {
    return this.walletsRepository.updateById(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletEntity>> {
    return this.walletsRepository.getAllWithPagination(options);
  }
}
