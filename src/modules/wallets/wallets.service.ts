import { Injectable } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import WalletsRepository from './wallets.repository';
import WalletEntity from '@entities/wallet.entity';

@Injectable()
export default class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  async getById(id: string): Promise<WalletEntity> {
    return this.walletsRepository.getById(id);
  }

  async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletEntity>> {
    return this.walletsRepository.getAllWithPagination(options);
  }
}
