import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AccountsController from './accounts.controller';
import AccountsService from './accounts.service';
import AccountEntity from './schemas/account.entity';
import AccountsRepository from './accounts.repository';
import ProfileEntity from './schemas/profile.entity';
import CompanyProfileEntity from './schemas/companyProfile.entity';
import SecurityQuestionAnswerEntity from './schemas/securityQuestionAnswer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity,ProfileEntity,CompanyProfileEntity,SecurityQuestionAnswerEntity])],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService, AccountsRepository],
})
export default class AccountsModule {}
