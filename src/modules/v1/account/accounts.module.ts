import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AccountsController from './accounts.controller';
import AccountsService from './accounts.service';
import AccountEntity from './schemas/account.entity';
import AccountsRepository from './accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService, AccountsRepository],
})
export default class AccountsModule {}
