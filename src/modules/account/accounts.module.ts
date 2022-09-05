import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountEntity } from '@entities/account.entity';
import { AccountsRepository } from './accounts.repository';
import { ProfileEntity } from '@entities/profile.entity';
import { CompanyProfileEntity } from '@entities/companyProfile.entity';
import { SecurityQuestionAnswerEntity } from '@entities/securityQuestionAnswer.entity';
import { RolesModule } from '@/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      ProfileEntity,
      CompanyProfileEntity,
      SecurityQuestionAnswerEntity,
    ]),
    RolesModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService, AccountsRepository],
})
export class AccountsModule {}
