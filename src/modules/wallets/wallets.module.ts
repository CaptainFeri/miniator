import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletsService } from './wallets.service';
import { WalletEntity } from '@entities/wallet.entity';
import { WalletsRepository } from './wallets.repository';
import { WalletTypesModule } from '@/wallet-types/wallet-types.module';
import { AuthModule } from '@/auth/auth.module';
import { wallet } from '../../config/wallet';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    WalletTypesModule,
    forwardRef(() => AuthModule),
    wallet,
  ],
  providers: [WalletsService, WalletsRepository],
  exports: [WalletsService, WalletsRepository],
})
export class WalletsModule {}
