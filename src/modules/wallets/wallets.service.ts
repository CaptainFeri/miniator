import { Injectable } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import WalletsRepository from './wallets.repository';
import WalletEntity from '@entities/wallet.entity';
import AccountEntity from '@entities/account.entity';
import WalletTypesRepository from '@/wallet-types/wallet-types.repository';
import CompanyRoleEntity from '@entities/company-role.entity';

@Injectable()
export default class WalletsService {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly walletTypesRepository: WalletTypesRepository,
  ) {}

  async getById(id: string): Promise<WalletEntity> {
    return this.walletsRepository.getById(id);
  }

  async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<WalletEntity>> {
    return this.walletsRepository.getAllWithPagination(options);
  }

  async addRoleWallets(account: AccountEntity, role: CompanyRoleEntity) {
    const types = await this.walletTypesRepository.getAll();
    const wallets = [];
    for (const type of types) {
      wallets.push(await this.walletsRepository.create(account, type, role));
    }
    return wallets;
  }
}
