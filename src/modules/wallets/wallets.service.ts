import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import WalletsRepository from './wallets.repository';
import WalletEntity from '@entities/wallet.entity';
import UpdateWalletDto from './dto/update-wallet.dto';
import CreateWalletDto from './dto/create-wallet.dto';

@Injectable()
export default class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  async create(wallet: CreateWalletDto): Promise<WalletEntity> {
    return this.walletsRepository.create(wallet);
  }

  async getById(id: string): Promise<WalletEntity> {
    return this.walletsRepository.getById(id);
  }

  update(data: UpdateWalletDto): Promise<UpdateResult> {
    return this.walletsRepository.updateById(data.id,data);
  }

  async getAllWithPagination(options: PaginationParamsInterface): Promise<PaginatedEntityInterface<WalletEntity>> {
    return this.walletsRepository.getAllWithPagination(options);
  }
}
