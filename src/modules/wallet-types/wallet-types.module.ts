import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WalletTypesService from './wallet-types.service';
import WalletTypeEntity from '@entities/wallet-type.entity';
import WalletTypesRepository from './wallet-types.repository';
import WalletTypesController from './wallet-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WalletTypeEntity])],
  controllers: [WalletTypesController],
  providers: [WalletTypesService, WalletTypesRepository],
  exports: [WalletTypesService, WalletTypesRepository],
})
export default class WalletTypesModule {}
