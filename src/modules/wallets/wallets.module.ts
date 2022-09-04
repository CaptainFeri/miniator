import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WalletsService from './wallets.service';
import WalletEntity from '@entities/wallet.entity';
import WalletsRepository from './wallets.repository';
import WalletsGrpcController from './wallets-grpc.controller';
import WalletTypesModule from '@/wallet-types/wallet-types.module';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity]), WalletTypesModule],
  controllers: [WalletsGrpcController],
  providers: [WalletsService, WalletsRepository],
  exports: [WalletsService, WalletsRepository],
})
export default class WalletsModule {}
