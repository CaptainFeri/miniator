import {
  BadRequestException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { AccountEntity } from '@entities/account.entity';
import { AccountsService } from './accounts.service';
import { User } from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { BanAccountDto, DeleteAccountDto } from './dto';
import PaginationUtils from '@utils/pagination.utils';
import { UpdateAccountDto } from '@/account/dto/update-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @MessagePattern('AccountService_Delete')
  async deleteAccount(
    @Payload() msg: any,
    @User() account: AccountEntity,
  ): Promise<any> {
    const data: DeleteAccountDto = msg.value;
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

  @MessagePattern('AccountService_GetByID')
  async getById(@Payload() msg: any) {
    const body: any = msg.value;
    const foundAccount = await this.accountsService.getVerifiedAccountById(
      body.id,
    );
    if (!foundAccount) {
      throw new NotFoundException('The account does not exist');
    }
    return foundAccount;
  }

  @MessagePattern('AccountService_GetAll')
  @Types(TypesEnum.superAdmin)
  async getAllVerifiedAccounts(@Payload() msg: any) {
    const query: any = msg.value;
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

  @MessagePattern('AccountService_Update')
  async update(@Payload() msg: any, @User() account: AccountEntity): Promise<any> {
    const dto: UpdateAccountDto = msg.value;
    await this.accountsService.update(account.id, dto);

    return {
      success: true,
    };
  }

  @MessagePattern('AccountService_UpdateProfile')
  async updateProfile(
    @Payload() msg: any,
    @User() account: AccountEntity,
  ): Promise<any> {
    const body: UpdateProfileDto = msg.value;
    await this.accountsService.updateProfile(account.id, body);

    return {
      success: true,
    };
  }

  @MessagePattern('AccountService_GetProfile')
  async getProfile(@User() account: AccountEntity): Promise<any> {
    const profile = await this.accountsService.getProfile(account.id);
    if (!profile) {
      throw new NotFoundException();
    }

    return profile;
  }

  @MessagePattern('AccountService_GetCompanyProfile')
  async getCompanyProfile(@User() account: AccountEntity): Promise<any> {
    const companyProfile = await this.accountsService.getCompanyProfile(
      account.id,
    );
    if (!companyProfile) {
      throw new NotFoundException();
    }

    return companyProfile;
  }

  @MessagePattern('AccountService_UpdateCompanyProfile')
  async updateCompanyProfile(
    @Payload() msg: any,
    @User() account: AccountEntity,
  ): Promise<any> {
    const body: UpdateCompanyProfileDto = msg.value;
    await this.accountsService.updateCompanyProfile(account.id, body);

    return {
      success: true,
    };
  }

  @MessagePattern('AccountService_Ban')
  @Types(TypesEnum.admin, TypesEnum.superAdmin)
  async banOrUnban(
    @Payload() msg: any,
    @User() account: AccountEntity,
  ): Promise<any> {
    const body: BanAccountDto = msg.value;
    await this.accountsService.banOrUnbanAccount(account.id, body.ban);

    return {
      success: true,
    };
  }
}
