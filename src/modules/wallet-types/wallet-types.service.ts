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
  constructor(private readonly walletsRepository: WalletTypesRepository) {}

  async create(wallet: CreateWalletTypeDto): Promise<WalletTypeEntity> {
    return this.walletsRepository.create(wallet);
  }

  async getById(id: string): Promise<WalletTypeEntity> {
    return this.walletsRepository.getById(id);
  }

  update(data: UpdateWalletTypeDto): Promise<UpdateResult> {
    return this.walletsRepository.updateById(data.id, data);
  }

  async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletTypeEntity>> {
    return this.walletsRepository.getAllWithPagination(options);
  }
}
