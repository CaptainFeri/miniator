import {
  Controller,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import Serialize from '@decorators/serialization.decorator';
import { AllAccountsResponseModel } from '@/account/models/account-response.model';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import AccountEntity from '@entities/account.entity';
import AccountsService from './accounts.service';
import { User } from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { DeleteAccountDto } from './dto';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import SignUpDto from '@/auth/dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { BanAccountDto } from './dto';
import { GrpcMethod } from '@nestjs/microservices';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @GrpcMethod('AccountService', 'Delete')
  @UseGuards(JwtAccessGuard)
  async deleteAccount(
    data: DeleteAccountDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    const deletedAccount = await this.accountsService.deleteAccount(
      account.id,
      data.password,
    );
    if (!deletedAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return ResponseUtils.success('accounts', { message: 'Success!' });
  }

  @GrpcMethod('AccountService', 'GetItem')
  @UseGuards(JwtAccessGuard)
  async getById(body: any): Promise<SuccessResponseInterface> {
    const foundAccount = await this.accountsService.getVerifiedAccountById(
      body.id,
    );
    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return ResponseUtils.success('accounts', foundAccount);
  }

  @GrpcMethod('AccountService', 'Get')
  @Types(TypesEnum.superAdmin)
  @Serialize(AllAccountsResponseModel)
  async getAllVerifiedAccounts(query: any) {
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

  @GrpcMethod('AccountService', 'Update')
  @UseGuards(JwtAccessGuard)
  async update(dto: SignUpDto, @User() account: AccountEntity): Promise<any> {
    await this.accountsService.update(account.id, dto);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }

  @UseGuards(JwtAccessGuard)
  @GrpcMethod('AccountService', 'UpdateProfile')
  async updateProfile(
    body: UpdateProfileDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.accountsService.updateProfile(account.id, body);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }

  @UseGuards(JwtAccessGuard)
  @GrpcMethod('AccountService', 'GetProfile')
  async getProfile(@User() account: AccountEntity): Promise<any> {
    const profile = await this.accountsService.getProfile(account.id);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
      profile,
    });
  }

  @UseGuards(JwtAccessGuard)
  @GrpcMethod('AccountService', 'GetCompanyProfile')
  async updateCompanyProfile(
    body: UpdateCompanyProfileDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.accountsService.updateCompanyProfile(account.id, body);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }

  @UseGuards(JwtAccessGuard)
  @GrpcMethod('AccountService', 'Ban')
  async banOrUnban(
    body: BanAccountDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.accountsService.banOrUnbanAccount(account.id, body.ban);
    return ResponseUtils.success('accounts', {
      message: 'Success!',
    });
  }
}
