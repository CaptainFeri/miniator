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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import AccountsService from '@v1/account/accounts.service';
import JwtAccessGuard from '@guards/jwt-access.guard';
import TypesGuard from '@guards/types.guard';
import AccountEntity from '@v1/account/schemas/account.entity';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import AuthBearer from '@decorators/auth-bearer.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { DecodedAccount } from './interfaces/decoded-account.interface';
import LocalAuthGuard from './guards/local-auth.guard';
import AuthService from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import JwtTokensDto from './dto/jwt-tokens.dto';
import ResponseUtils from '../../../utils/response.utils';
import authConstants from '@v1/auth/auth-constants';
import { User } from '@decorators/user.decorator';
import { Public } from '@decorators/public.decorator';
import JwtRefreshGuard from '@guards/jwt-refresh.guard';
import AdminEntity from '@v1/admin/schemas/admin.entity';
import AdminLocalAuthGuard from '@v1/auth/guards/admin-local-auth.guard';

@ApiTags('Auth')
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(JwtTokensDto)
@Controller()
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(JwtTokensDto),
        },
      },
    },
    description: 'Returns jwt tokens',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              email: 'string',
              password: 'string',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @User() accountEntity: any,
  ): Promise<SuccessResponseInterface | never> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = accountEntity;

    return ResponseUtils.success('tokens', await this.authService.login(user));
  }

  @UseGuards(AdminLocalAuthGuard)
  @Post('admins/sign-in')
  async adminSignIn(
    @User() adminEntity: any,
  ): Promise<SuccessResponseInterface | never> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...admin } = adminEntity;

    return ResponseUtils.success('tokens', await this.authService.login(admin));
  }

  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    description: '201, Success',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              email: 'string',
              password: 'string',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '409. ConflictResponse',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @Public()
  async signUp(@Body() account: SignUpDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, email } = await this.accountsService.create(account);
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

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(JwtTokensDto),
        },
      },
    },
    description: '200, returns new jwt tokens',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError ',
  })
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

  @ApiNoContentResponse({
    description: 'No content. 204',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        error: 'Not Found',
      },
    },
    description: 'Account was not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
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

  @ApiNoContentResponse({
    description: 'no content',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: 'InternalServerError',
  })
  @ApiBearerAuth()
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

  @ApiNoContentResponse({
    description: 'no content',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @ApiBearerAuth()
  @Delete('logout-all')
  @UseGuards(TypesGuard)
  @Types(TypesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(): Promise<string> {
    return this.authService.deleteAllTokens();
  }

  @ApiOkResponse({
    type: AccountEntity,
    description: '200, returns a decoded user from access token',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '403, says you Unauthorized',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @ApiBearerAuth()
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
