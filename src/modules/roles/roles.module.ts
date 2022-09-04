import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import RolesService from './roles.service';
import RolesRepository from './roles.repository';
import CompanyRoleRequestEntity from '@entities/company-role-request.entity';
import CompanyRoleEntity from '@entities/company-role.entity';
import RoleRequestsRepository from './role-request.repository';
import RolesController from './roles.controller';
import WalletsModule from '@/wallets/wallets.module';
import AccountsModule from '@/account/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRoleRequestEntity, CompanyRoleEntity]),
    WalletsModule,
    forwardRef(() => AccountsModule),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RoleRequestsRepository],
  exports: [RolesService, RolesRepository],
})
export default class RolesModule {}
