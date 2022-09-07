import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { WalletsRepository } from './wallets.repository';
import { WalletEntity } from '@entities/wallet.entity';
import { AccountEntity } from '@entities/account.entity';
import { WalletTypesRepository } from '@/wallet-types/wallet-types.repository';
import { CompanyRoleEntity } from '@entities/company-role.entity';
import { AuthRepository } from '@/auth/auth.repository';
import {
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from '@interfaces/wallet.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletsService implements OnModuleInit {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly walletTypesRepository: WalletTypesRepository,
    @Inject(forwardRef(() => AuthRepository))
    private readonly authRepository: AuthRepository,
    @Inject('WALLET_SERVICE') private client: ClientGrpc,
  ) {}

  private walletsService: WalletServiceClient;

  onModuleInit() {
    this.walletsService =
      this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

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
      const wallet = await this.walletsRepository.create(account, type, role);
      await this.authRepository.addUserRole(
        account.id,
        role.company.id,
        role.id,
        type.name,
        wallet.id,
      );
      await firstValueFrom(
        this.walletsService.create({
          walletId: wallet.id,
          companyId: role.company.id,
        }),
      );
    }
    return wallets;
  }
}
