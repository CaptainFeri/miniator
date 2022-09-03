import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Put,
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
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import Serialize from '@decorators/serialization.decorator';
import { AllAccountsResponseModel } from '@modules/account/models/account-response.model';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import AccountEntity from '@entities/account.entity';
import AccountsService from './accounts.service';
import { User } from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { API_CONFLICT, API_INTERNAL_SERVER_ERROR, API_UNAUTHORIZED, DELETE_ACCOUNT_BAD, GET_PROFILE, UPDATE_ACCOUNT_BAD, DELETE_ACCOUNT, API_NOT_FOUND, UPDATE_ACCOUNT, API_PARAM_CONSTANTS } from './constants';
import { DeleteAccountDto } from './dto';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import SignUpDto from '@modules/auth/dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { Public } from '@decorators/public.decorator';
import { UpdateCompanyProfileDto } from './dto/update-compony-profile.dto';
import { BanAccountDto } from './dto/ban-account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(AccountEntity)
@Controller()
export default class AccountsController {

  constructor(private readonly accountsService: AccountsService) { }


  @Delete()
  @UseGuards(JwtAccessGuard)
  async deleteAccount(@Body() data: DeleteAccountDto, @User() account: AccountEntity): Promise<any> {
    const deletedAccount = await this.accountsService.deleteAccount(account.id, data.password);
    if (!deletedAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return ResponseUtils.success('accounts', { message: 'Success!' });
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponseInterface> {
    const foundAccount = await this.accountsService.getVerifiedAccountById(id);
    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return ResponseUtils.success('accounts', foundAccount);
  }

  @Get()
  @Types(TypesEnum.superAdmin)
  @Serialize(AllAccountsResponseModel)
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

  @Get('profile')
  @UseGuards(JwtAccessGuard)
  async getProfile(@User() account: AccountEntity) {
    const foundAccount = await this.accountsService.getVerifiedAccountById(account.id);
    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return ResponseUtils.success('accounts', foundAccount);
  }

  @Put()
  @UseGuards(JwtAccessGuard)
  async update(@User() account: AccountEntity, @Body() dto: SignUpDto): Promise<any> {
    await this.accountsService.update(account.id, dto);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }

  @UseGuards(JwtAccessGuard)
  @Put('profile')
  async updateProfile(@Body() body: UpdateProfileDto, @User() account: AccountEntity): Promise<any> {
    await this.accountsService.updateProfile(account.id, body);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }

  // @UseGuards(JwtAccessGuard)
  // @Get('profile')
  // async getProfile(@User() account: AccountEntity): Promise<any> {
  //   const profile = await this.accountsService.getProfile(account.id);
  //   return ResponseUtils.success('accounts', {
  //     message: 'Success!',
  //     profile,
  //   });
  // }

  @UseGuards(JwtAccessGuard)
  @Put('compony/profile')
  async updateComponyProfile(@Body() body: UpdateCompanyProfileDto, @User() account: AccountEntity): Promise<any> {
    await this.accountsService.updateComponyProfile(account.id, body);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }

  @UseGuards(JwtAccessGuard)
  @Put('ban')
  async banOrUnban(@Body() body: BanAccountDto,@User() account: AccountEntity): Promise<any> {
    await this.accountsService.banOrUnbanAccount(account.id,body.ban);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }
}
