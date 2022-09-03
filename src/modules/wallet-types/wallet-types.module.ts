import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WalletTypesService from './wallet-types.service';
import WalletTypeEntity from '@entities/wallet-type.entity';
import WalletTypesRepository from './wallet-types.repository';
import WalletTypesGrpcController from './wallet-types-grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WalletTypeEntity])],
  controllers: [WalletTypesGrpcController],
  providers: [WalletTypesService, WalletTypesRepository],
  exports: [WalletTypesService, WalletTypesRepository],
})
export default class WalletTypesModule {}
