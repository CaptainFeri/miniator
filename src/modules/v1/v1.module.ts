import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';

import SecurityQuestionsModule from '@v1/securityQuestion/securityQuestions.module';
import AuthModule from './auth/auth.module';
import AccountsModule from './account/accounts.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/accounts', module: AccountsModule },
      { path: '/security-questions', module: SecurityQuestionsModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AuthModule,
    AccountsModule,
    SecurityQuestionsModule,
  ],
})
export default class V1Module {}
