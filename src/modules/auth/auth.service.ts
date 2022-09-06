import * as bcrypt from 'bcryptjs';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '@/account/accounts.service';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { ValidateAccountOutput } from './interfaces/validate-account-output.interface';
import { LoginPayload } from './interfaces/login-payload.interface';
import authConstants from './constants/auth-constants';
import { AuthRepository } from './auth.repository';
import { TypesEnum } from '@decorators/types.decorator';
import { DecodedAccount } from './interfaces/decoded-account.interface';
import { AccountEntity } from '@entities/account.entity';
import { SignInDto } from '@/auth/dto/sign-in.dto';

@Injectable()
export class AuthService {
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
    const pwd = await this.authRepository.getPassword(username);

    if (!pwd) {
      throw new NotFoundException('The item does not exist');
    }

    const passwordCompared = await bcrypt.compare(password, pwd);

    const id = await this.authRepository.getId(username);

    if (passwordCompared) {
      return {
        id: id,
        username,
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

  async accessToken(payload: LoginPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.accessToken,
      secret: this.configService.get<string>('ACCESS_SECRET'),
    });
  }

  async login(payload: any): Promise<JwtTokensDto> {
    const accessToken = await this.accessToken(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.refreshToken,
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });

    // await this.authRepository.addRefreshToken(
    //   ((payload.type === TypesEnum.admin ? 'admin:' : '') +
    //     payload.username) as string,
    //   refreshToken,
    // );

    return {
      accessToken,
      refreshToken,
    };
  }

  getRefreshTokenByUsername(_username: string): string {
    return '';
    // return this.authRepository.getToken(username);
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

  async createPayload(id: string, signIn: SignInDto) {
    const wallets = await this.authRepository.getWallets(
      id,
      signIn.companyId,
      signIn.roleId,
    );
    if (!wallets) {
      throw new BadRequestException();
    }
    return {
      id,
      services: [
        {
          id: signIn.companyId,
          roles: {
            id: signIn.roleId,
            wallets,
          },
        },
      ],
    };
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

  async addUserToRedis(account: AccountEntity) {
    await this.authRepository.addUser(account);
  }
}
