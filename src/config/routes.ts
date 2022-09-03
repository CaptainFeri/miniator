import { Routes } from '@nestjs/core';
import AccountsModule from '@modules/account/accounts.module';
import AdminsModule from '@modules/admin/admins.module';
import AuthModule from '@modules/auth/auth.module';
import CompaniesModule from '@modules/company/companies.module';
import RolesModule from '@modules/roles/roles.module';
import SecurityQuestionsModule from '@modules/security-question/security-question.module';
import WalletsModule from '@modules/wallets/wallets.module';

export const ROUTES: Routes = [
  {
    path: '/v1',
    children: [
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/admins',
        module: AdminsModule,
      },
      {
        path: '/accounts',
        module: AccountsModule,
      },
      {
        path: '/roles',
        module: RolesModule,
      },
      {
        path: '/companies',
        module: CompaniesModule,
      },
      {
        path: '/wallets',
        module: WalletsModule,
      },
      {
        path: '/security-questions',
        module: SecurityQuestionsModule,
      },
    ],
  },
];
