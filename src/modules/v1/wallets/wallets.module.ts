import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WalletsController from './wallets.controller';
import WalletsService from './wallets.service';
import WalletEntity from './schemas/wallet.entity';
import WalletsRepository from './wallets.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity])],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository],
  exports: [WalletsService, WalletsRepository],
})
export default class WalletsModule {}
