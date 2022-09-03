import { Injectable } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import WalletsRepository from './wallets.repository';
import WalletEntity from '@entities/wallet.entity';
import AccountEntity from '@entities/account.entity';
import WalletTypesRepository from '@/wallet-types/wallet-types.repository';
import RolesRepository from '@/roles/roles.repository';

@Injectable()
export default class WalletsService {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly walletTypesRepository: WalletTypesRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async getById(id: string): Promise<WalletEntity> {
    return this.walletsRepository.getById(id);
  }

  async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletEntity>> {
    return this.walletsRepository.getAllWithPagination(options);
  }

  async createCommonWallets(account: AccountEntity) {
    const roles = await this.rolesRepository.getAllCommon();
    const types = await this.walletTypesRepository.getAll();
    const wallets = [];
    for (const role of roles) {
      for (const type of types) {
        wallets.push(await this.walletsRepository.create(account, type, role));
      }
    }
    return wallets;
  }
}
