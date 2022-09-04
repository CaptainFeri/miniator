import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import WalletTypesRepository from './wallet-types.repository';
import WalletTypeEntity from '@entities/wallet-type.entity';
import UpdateWalletTypeDto from './dto/update-wallet-type.dto';
import CreateWalletTypeDto from './dto/create-wallet-type.dto';

@Injectable()
export default class WalletTypesService {
  constructor(private readonly walletTypesRepository: WalletTypesRepository) {}

  async create(wallet: CreateWalletTypeDto): Promise<WalletTypeEntity> {
    // TODO: create wallets for new type
    return await this.walletTypesRepository.create(wallet);
  }

  async getById(id: string): Promise<WalletTypeEntity> {
    return this.walletTypesRepository.getById(id);
  }

  update(data: UpdateWalletTypeDto): Promise<UpdateResult> {
    return this.walletTypesRepository.updateById(data.id, data);
  }

  async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletTypeEntity>> {
    return this.walletTypesRepository.getAllWithPagination(options);
  }
}
