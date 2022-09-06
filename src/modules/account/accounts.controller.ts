import {
  BadRequestException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { AccountEntity } from '@entities/account.entity';
import { AccountsService } from './accounts.service';
import { User } from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { BanAccountDto, DeleteAccountDto } from './dto';
import PaginationUtils from '@utils/pagination.utils';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @GrpcMethod('AccountService', 'Delete')
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

    return {
      success: true,
    };
  }

  @GrpcMethod('AccountService', 'GetByID')
  async getById(body: any) {
    const foundAccount = await this.accountsService.getVerifiedAccountById(
      body.id,
    );
    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return foundAccount;
  }

  @GrpcMethod('AccountService', 'GetAll')
  @Types(TypesEnum.superAdmin)
  async getAllVerifiedAccounts(query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedAccounts: PaginatedEntityInterface<AccountEntity> =
      await this.accountsService.getAllVerifiedWithPagination(paginationParams);

    return {
      accounts: paginatedAccounts.paginatedResult,
      totalCount: paginatedAccounts.totalCount,
    };
  }

  @GrpcMethod('AccountService', 'Update')
  async update(dto: SignUpDto, @User() account: AccountEntity): Promise<any> {
    await this.accountsService.update(account.id, dto);

    return {
      success: true,
    };
  }

  @GrpcMethod('AccountService', 'UpdateProfile')
  async updateProfile(
    body: UpdateProfileDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.accountsService.updateProfile(account.id, body);

    return {
      success: true,
    };
  }

  @GrpcMethod('AccountService', 'GetProfile')
  async getProfile(@User() account: AccountEntity): Promise<any> {
    const profile = await this.accountsService.getProfile(account.id);
    if (!profile) {
      throw new NotFoundException();
    }

    return profile;
  }

  @GrpcMethod('AccountService', 'GetCompanyProfile')
  async getCompanyProfile(@User() account: AccountEntity): Promise<any> {
    const companyProfile = await this.accountsService.getCompanyProfile(
      account.id,
    );
    if (!companyProfile) {
      throw new NotFoundException();
    }

    return companyProfile;
  }

  @GrpcMethod('AccountService', 'UpdateCompanyProfile')
  async updateCompanyProfile(
    body: UpdateCompanyProfileDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.accountsService.updateCompanyProfile(account.id, body);

    return {
      success: true,
    };
  }

  @Types(TypesEnum.admin, TypesEnum.superAdmin)
  @GrpcMethod('AccountService', 'Ban')
  async banOrUnban(
    body: BanAccountDto,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.accountsService.banOrUnbanAccount(account.id, body.ban);

    return {
      success: true,
    };
  }
}
