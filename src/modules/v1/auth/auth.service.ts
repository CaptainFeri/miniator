import * as bcrypt from 'bcryptjs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import AccountsService from '@v1/account/accounts.service';

import { DecodedAccount } from '@v1/auth/interfaces/decoded-account.interface';
import JwtTokensDto from './dto/jwt-tokens.dto';
import { ValidateAccountOutput } from './interfaces/validate-account-output.interface';
import { LoginPayload } from './interfaces/login-payload.interface';

import authConstants from './auth-constants';
import AuthRepository from './auth.repository';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) { }

  async validateAccount(
    username: string,
    password: string,
  ): Promise<null | ValidateAccountOutput> {
    const account = await this.usersService.getVerifiedAccountByUsername(username);

    if (!account) {
      throw new NotFoundException('The item does not exist');
    }

    const passwordCompared = await bcrypt.compare(password, account.password);

    if (passwordCompared) {
      return {
        id: account.id,
        username: account.username,
        type: account.type,
      };
    }

    return null;
  }

  async login(data: LoginPayload): Promise<JwtTokensDto> {
    const payload: LoginPayload = {
      id: data.id,
      username: data.username,
      type: data.type,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.accessToken,
      secret: this.configService.get<string>('ACCESS_TOKEN') || '283f01ccce922bcc2399e7f8ded981285963cec349daba382eb633c1b3a5f282',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.refreshToken,
      secret: this.configService.get<string>('REFRESH_TOKEN') || 'c15476aec025be7a094f97aac6eba4f69268e706e603f9e1ec4d815396318c86',
    });

    await this.authRepository.addRefreshToken(
      payload.username as string,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  getRefreshTokenByUsername(username: string): Promise<string | null> {
    return this.authRepository.getToken(username);
  }

  deleteTokenByUsername(username: string): Promise<number> {
    return this.authRepository.removeToken(username);
  }

  deleteAllTokens(): Promise<string> {
    return this.authRepository.removeAllTokens();
  }

  public createVerifyToken(id: number): string {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: authConstants.jwt.expirationTime.accessToken,
        secret: this.configService.get<string>('ACCESS_TOKEN') || '283f01ccce922bcc2399e7f8ded981285963cec349daba382eb633c1b3a5f282',
      },
    );
  }

  public verifyEmailVerToken(token: string, secret: string) {
    return this.jwtService.verifyAsync(token, { secret });
  }

  public async verifyToken(
    token: string,
    secret: string,
  ): Promise<DecodedAccount | null> {
    try {
      const user = (await this.jwtService.verifyAsync(token, {
        secret,
      })) as DecodedAccount | null;

      return user;
    } catch (error) {
      return null;
    }
  }
}
