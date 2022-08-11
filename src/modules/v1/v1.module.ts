import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';

import SecurityQuestionsModule from './securityQuestion/securityQuestions.module';
import AuthModule from './auth/auth.module';
import AccountsModule from './account/accounts.module';
import AdminsModule from './admin/admins.module';
import CompaniesModule from './company/companies.module';
import RolesModule from '@v1/roles/roles.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/admins', module: AdminsModule },
      { path: '/accounts', module: AccountsModule },
      { path: '/roles', module: RolesModule },
      { path: '/companies', module: CompaniesModule },
      { path: '/security-questions', module: SecurityQuestionsModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AuthModule,
    AdminsModule,
    AccountsModule,
    RolesModule,
    CompaniesModule,
    SecurityQuestionsModule,
  ],
})
export default class V1Module {}
