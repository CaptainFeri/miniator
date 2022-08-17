import * as bcrypt from 'bcryptjs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import AccountsService from 'src/modules/account/accounts.service';
import JwtTokensDto from './dto/jwt-tokens.dto';
import { ValidateAccountOutput } from './interfaces/validate-account-output.interface';
import { LoginPayload } from './interfaces/login-payload.interface';
import authConstants from './constants/auth-constants';
import AuthRepository from './auth.repository';
import { TypesEnum } from 'src/shared/decorators/types.decorator';
import { DecodedAccount } from './interfaces/decoded-account.interface';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  async validateAccount(
    username: string,
    password: string,
  ): Promise<null | ValidateAccountOutput> {
    const account = await this.usersService.getVerifiedAccountByUsername(
      username,
    );

    if (!account) {
      throw new NotFoundException('The item does not exist');
    }

    const passwordCompared = await bcrypt.compare(password, account.password);

    if (passwordCompared) {
      return {
        id: account.id,
        username: account.username,
        type: TypesEnum.user,
      };
    }

    return null;
  }

  async validateAdmin(
    username: string,
    password: string,
  ): Promise<null | ValidateAccountOutput> {
    const account = await this.usersService.getVerifiedAccountByUsername(
      username,
    );

    if (!account) {
      throw new NotFoundException('The item does not exist');
    }

    const passwordCompared = await bcrypt.compare(password, account.password);

    if (passwordCompared) {
      return {
        id: account.id,
        username: account.username,
        type: TypesEnum.admin,
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
      secret: this.configService.get<string>('ACCESS_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.refreshToken,
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });

    await this.authRepository.addRefreshToken(
      ((data.type === TypesEnum.admin ? 'admin:' : '') +
        payload.username) as string,
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

  public createVerifyToken(id: string): string {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: authConstants.jwt.expirationTime.accessToken,
        secret: this.configService.get<string>('ACCESS_SECRET'),
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
      return (await this.jwtService.verifyAsync(token, {
        secret,
      })) as DecodedAccount | null;
    } catch (error) {
      return null;
    }
  }
}
