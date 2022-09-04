import {
  Body,
  Controller,
  HttpCode,
  Get,
  Post,
  Delete,
  Param,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import AccountsService from '@/account/accounts.service';
import JwtAccessGuard from '@guards/jwt-access.guard';
import TypesGuard from '@guards/types.guard';
import AccountEntity from '@entities/account.entity';
import AuthBearer from '@decorators/auth-bearer.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { DecodedAccount } from './interfaces/decoded-account.interface';
import AuthService from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import ResponseUtils from '@utils/response.utils';
import { User } from '@decorators/user.decorator';
import { Public } from '@decorators/public.decorator';
import JwtRefreshGuard from '@guards/jwt-refresh.guard';
import AdminEntity from '@entities/admin.entity';
import authConstants from './constants/auth-constants';
import { GrpcMethod } from '@nestjs/microservices';
import AdminsService from '@/admin/admins.service';
import VerifyAccountTokenDto from './dto/verify-account.dto';

// @ApiTags('Auth')
// @UseInterceptors(WrapResponseInterceptor)
// @ApiExtraModels(JwtTokensDto)
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
    private readonly adminService: AdminsService,
    private readonly configService: ConfigService,
  ) {}

  @GrpcMethod('AuthService', 'Login')
  async Login(data: SignInDto) {
    const login = await this.accountsService.login(
      data.username,
      data.password,
    );
    if (login.status) {
      const user = {
        username: login.username,
        id: login.id,
        type: login.type,
      };
      return ResponseUtils.success(
        'tokens',
        await this.authService.login(user),
      );
    }
    return ResponseUtils.error(login.message);
  }

  @GrpcMethod('AuthService', 'LoginAdmin')
  async LoginAdmin(data: SignInDto) {
    const login = await this.adminService.login(data.username, data.password);
    if (login.status) {
      const user = {
        username: login.username,
        id: login.id,
        type: login.type,
      };
      const data = ResponseUtils.success(
        'tokens',
        await this.authService.login(user),
      );
      console.log(data);
      return data;
    }
    return ResponseUtils.error(login.message);
  }

  @UseGuards(JwtRefreshGuard)
  @GrpcMethod('AuthService', 'refreshToken1')
  async refreshToken1(data: RefreshTokenDto, @User('authorization') account) {
    const oldRefreshToken: string | null =
      await this.authService.getRefreshTokenByUsername(account.username);
    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== data.refreshToken) {
      throw new UnauthorizedException(
        'Authentication credentials were missing or incorrect',
      );
    }
    const payload = {
      id: account.id,
      username: account.username,
      type: TypesEnum.user,
    };
    return ResponseUtils.success(
      'tokens',
      await this.authService.login(payload),
    );
  }

  @GrpcMethod('AuthService', 'SignUp')
  async SignUp(data: SignUpDto) {
    const { id } = await this.accountsService.create(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = this.authService.createVerifyToken(id);

    // await this.mailerService.sendMail({
    //   to: email,
    //   from: this.configService.get<string>('MAILER_FROM_EMAIL'),
    //   subject: authConstants.mailer.verifyEmail.subject,
    //   template: `${process.cwd()}/src/templates/verify-password`,
    //   context: {
    //     token,
    //     email,
    //     host: this.configService.get('HOST'),
    //   },
    // });
    return ResponseUtils.success('auth', {
      message: 'Success! please verify your email',
      // TODO: remove this for production
      url: `${this.configService.get('HOST')}/auth/verify?token=${token}`,
    });
  }

  @GrpcMethod('AuthService', 'Verify')
  async Verify(data: VerifyAccountTokenDto) {
    const { id } = await this.authService.verifyEmailVerToken(
      data.token,
      this.configService.get<string>(
        'ACCESS_SECRET',
        authConstants.jwt.secrets.accessToken,
      ),
    );
    const foundAccount = await this.accountsService.getUnverifiedAccountById(
      id,
    );
    if (!foundAccount) {
      throw new NotFoundException('The user does not exist');
    }

    await this.authService.addUserToRedis(foundAccount);

    await this.accountsService.verify(foundAccount.id);

    return ResponseUtils.success('users', {
      message: 'Success!',
    });
  }

  @Public()
  @Post('sign-in')
  async signInApi(
    @User() account: any,
  ): Promise<SuccessResponseInterface | never> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = account;

    return ResponseUtils.success('tokens', await this.authService.login(user));
  }

  @Public()
  @Post('admins/sign-in')
  async adminSignIn(
    @User() adminEntity: any,
  ): Promise<SuccessResponseInterface | never> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...admin } = adminEntity;

    return ResponseUtils.success('tokens', await this.authService.login(admin));
  }

  @Post('refresh-token')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @User() account: AccountEntity,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SuccessResponseInterface | never> {
    const oldRefreshToken: string | null =
      await this.authService.getRefreshTokenByUsername(account.username);

    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException(
        'Authentication credentials were missing or incorrect',
      );
    }

    const payload = {
      id: account.id,
      username: account.username,
      type: TypesEnum.user,
    };

    return ResponseUtils.success(
      'tokens',
      await this.authService.login(payload),
    );
  }

  @Post('admins/refresh-token')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async adminRefreshToken(
    @User() admin: AdminEntity,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SuccessResponseInterface | never> {
    const oldRefreshToken: string | null =
      await this.authService.getRefreshTokenByUsername(
        'admin:' + admin.username,
      );

    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException(
        'Authentication credentials were missing or incorrect',
      );
    }

    const payload = {
      id: admin.id,
      username: admin.username,
      type: TypesEnum.admin,
    };

    return ResponseUtils.success(
      'tokens',
      await this.authService.login(payload),
    );
  }

  @Get('verify')
  @Public()
  async verifyAccount(
    @Query('token') token: string,
  ): Promise<SuccessResponseInterface | never> {
    const { id } = await this.authService.verifyEmailVerToken(
      token,
      this.configService.get<string>(
        'ACCESS_SECRET',
        authConstants.jwt.secrets.accessToken,
      ),
    );
    const foundAccount = await this.accountsService.getUnverifiedAccountById(
      id,
    );

    if (!foundAccount) {
      throw new NotFoundException('The user does not exist');
    }

    return ResponseUtils.success(
      'users',
      await this.accountsService.update(foundAccount.id, { verified: true }),
    );
  }

  @UseGuards(JwtAccessGuard)
  @Delete('logout/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Param('token') token: string) {
    const decodedAccount: DecodedAccount | null =
      await this.authService.verifyToken(
        token,
        this.configService.get<string>(
          'ACCESS_SECRET',
          authConstants.jwt.secrets.accessToken,
        ),
      );

    if (!decodedAccount) {
      throw new ForbiddenException('Incorrect token');
    }

    const deletedAccountsCount = await this.authService.deleteTokenByUsername(
      (decodedAccount.type === TypesEnum.admin ? 'admin:' : '') +
        decodedAccount.username,
    );

    if (deletedAccountsCount === 0) {
      throw new NotFoundException();
    }
  }

  @Delete('logout-all')
  @UseGuards(TypesGuard)
  @Types(TypesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(): Promise<string> {
    return this.authService.deleteAllTokens();
  }

  @UseGuards(JwtAccessGuard)
  @Get('token')
  async getAccountByAccessToken(
    @AuthBearer() token: string,
  ): Promise<SuccessResponseInterface | never> {
    const decodedAccount: DecodedAccount | null =
      await this.authService.verifyToken(
        token,
        this.configService.get<string>(
          'ACCESS_SECRET',
          authConstants.jwt.secrets.accessToken,
        ),
      );

    if (!decodedAccount) {
      throw new ForbiddenException('Incorrect token');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, ...user } = decodedAccount;

    return ResponseUtils.success('users', user);
  }
}
