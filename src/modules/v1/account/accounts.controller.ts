import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import Serialize from '@decorators/serialization.decorator';
import { AllAccountsResponseEntity } from '@v1/account/entities/account-response.entity';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import SignUpDto from '@v1/auth/dto/sign-up.dto';
import AccountEntity from './schemas/account.entity';
import AccountsService from './accounts.service';
import PaginationUtils from '../../../utils/pagination.utils';
import ResponseUtils from '../../../utils/response.utils';
import DeleteAccountDto from './dto/delete-account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(AccountEntity)
@Controller()
export default class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOkResponse({
    description: '200, Success',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Account was not found',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
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
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Post('delete-account')
  @UseGuards(JwtAccessGuard)
  async deleteAccount(
    @Body() data: DeleteAccountDto,
    @Request() req: ExpressRequest,
  ): Promise<any> {
    const deletedAccount = await this.accountsService.deleteAccount(
      (req.user as AccountEntity).id,
      data.password,
    );

    if (!deletedAccount) {
      throw new NotFoundException('The account does not exist');
    }

    return ResponseUtils.success('accounts', { message: 'Success!' });
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(AccountEntity),
        },
      },
    },
    description: '200. Success. Returns a account',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Account was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @Get(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(AllAccountsResponseEntity)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseInterface> {
    const foundAccount = await this.accountsService.getVerifiedAccountById(id);

    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }

    return ResponseUtils.success('accounts', foundAccount);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(AccountEntity),
        },
      },
    },
    description: '200. Success. Returns all accounts',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Get()
  @UseGuards(JwtAccessGuard)
  @Serialize(AllAccountsResponseEntity)
  async getAllVerifiedAccounts(@Query() query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedAccounts: PaginatedEntityInterface<AccountEntity> =
      await this.accountsService.getAllVerifiedWithPagination(paginationParams);

    return ResponseUtils.success(
      'accounts',
      paginatedAccounts.paginatedResult,
      {
        location: 'accounts',
        paginationParams,
        totalCount: paginatedAccounts.totalCount,
      },
    );
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(AccountEntity),
        },
      },
    },
    description: '200. Success. Returns a account',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Account was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Get('profile')
  @UseGuards(JwtAccessGuard)
  @Serialize(AllAccountsResponseEntity)
  async getProfile(
    @Request() req: ExpressRequest,
  ): Promise<SuccessResponseInterface> {
    const foundAccount = await this.accountsService.getVerifiedAccountById(
      (req.user as AccountEntity).id,
    );

    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }

    return ResponseUtils.success('accounts', foundAccount);
  }

  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    description: '200, Success',
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
  @HttpCode(HttpStatus.OK)
  @Post('update-profile')
  @UseGuards(JwtAccessGuard)
  async updateProfile(
    @Request() req: ExpressRequest,
    @Body() account: SignUpDto,
  ): Promise<any> {
    await this.accountsService.update((req.user as AccountEntity).id, account);

    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }
}
