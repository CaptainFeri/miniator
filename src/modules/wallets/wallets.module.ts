import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WalletsService from './wallets.service';
import WalletEntity from '@entities/wallet.entity';
import WalletsRepository from './wallets.repository';
import WalletsController from './wallets.controller';
import WalletTypesModule from '@/wallet-types/wallet-types.module';
import AuthModule from '@/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    WalletTypesModule,
    AuthModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository],
  exports: [WalletsService, WalletsRepository],
})
export default class WalletsModule {}
