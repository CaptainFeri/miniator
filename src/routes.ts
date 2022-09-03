import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import AccountsModule from 'src/modules/account/accounts.module';
import AdminsModule from './modules/admin/admins.module';
import AuthModule from './modules/auth/auth.module';
import CompaniesModule from './modules/company/companies.module';
import RolesModule from './modules/roles/roles.module';
import SecurityQuestionsModule from './modules/security-question/security-question.module';
import WalletsModule from './modules/wallets/wallets.module';
import { ROUTES } from './config/routes';
import WalletTypesModule from '@modules/wallet-types/wallet-types.module';

@Module({
  imports: [
    RouterModule.register(ROUTES),
    AuthModule,
    AdminsModule,
    AccountsModule,
    RolesModule,
    CompaniesModule,
    SecurityQuestionsModule,
    WalletTypesModule,
    WalletsModule,
  ],
})
export default class RouteModule {}
