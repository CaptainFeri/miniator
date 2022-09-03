import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import AccountsModule from '@modules/account/accounts.module';
import AuthRepository from './auth.repository';
import LocalStrategy from './strategies/local.strategy';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import JwtRefreshStrategy from './strategies/jwt-refresh.strategy';

import authConstants from './constants/auth-constants';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import AdminsModule from '@modules/admin/admins.module';

@Module({
  imports: [
    AdminsModule,
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: authConstants.jwt.secret,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
