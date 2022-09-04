import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AccountEntity from '@entities/account.entity';
import PaginationUtils from '@utils/pagination.utils';
import { UpdateAccountDto } from './dto';
import SignUpDto from '@/auth/dto/sign-up.dto';
import { LoginModel } from './models/login.model';
import { TypesEnum } from '@decorators/types.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import ProfileEntity from '@entities/profile.entity';
import CompanyProfileEntity from '@entities/companyProfile.entity';
import { UpdateCompanyProfileDto } from './dto/update-compony-profile.dto';

@Injectable()
export default class AccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsModel: Repository<AccountEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileModel: Repository<ProfileEntity>,
    @InjectRepository(CompanyProfileEntity)
    private readonly companyProfileModel: Repository<CompanyProfileEntity>,
  ) {}

  public create(user: SignUpDto): Promise<AccountEntity> {
    return this.accountsModel.save({
      ...user,
      banned: false,
      blocked: false,
      verified: false,
    });
  }

  public async getByEmail(email: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [
        {
          email,
          deleted: false,
        },
      ],
    });
  }

  public async getVerifiedAccountByEmail(
    email: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [
        {
          email,
          verified: true,
          deleted: false,
        },
      ],
    });
  }

  public async getVerifiedAccountByUsername(
    username: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [
        {
          username,
          verified: true,
          deleted: false,
        },
      ],
    });
  }

  public async getUnverifiedAccountByEmail(
    email: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      email,
      verified: false,
      deleted: false,
    });
  }

  public async getById(id: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      id,
      deleted: false,
    });
  }

  public async getVerifiedAccountById(
    id: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      id,
      verified: true,
      deleted: false,
    });
  }

  public async getUnverifiedAccountById(
    id: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      id,
      verified: false,
      deleted: false,
    });
  }

  public updateById(id: string, data: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountsModel.update(
      {
        id,
        deleted: false,
      },
      data,
    );
  }

  public async getAllVerifiedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<AccountEntity>> {
    const verified = true;
    const [users, totalCount] = await Promise.all([
      this.accountsModel.find({
        where: {
          verified,
          deleted: false,
        },
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.accountsModel.count({
        where: { verified },
      }),
    ]);

    return {
      paginatedResult: users,
      totalCount,
    };
  }

  public async deleteAccount(account: AccountEntity): Promise<AccountEntity> {
    await this.accountsModel.update(account.id, {
      deleted: true,
    });
    return await this.accountsModel.findOne(account.id);
  }

  async login(username: string, password: string): Promise<LoginModel> {
    const user = await this.accountsModel.findOne({
      where: {
        username: username,
        deleted: false,
      },
    });
    if (user) {
      if (user.password === password) {
        return {
          status: true,
          username: user.username,
          id: user.id,
          type: TypesEnum.user,
        };
      }
      return { status: false, message: 'Wrong password' };
    }
    return { status: false, message: 'User not found' };
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    const account = await this.accountsModel.findOne(id);
    await this.accountsModel.save({
      ...account,
      profile: data,
    });
  }

  async getProfile(id: string) {
    const account = await this.accountsModel.findOne(id);
    return account.profile;
  }

  async updateCompanyProfile(id: string, data: UpdateCompanyProfileDto) {
    const account = await this.accountsModel.findOne(id);
    await this.accountsModel.save({
      ...account,
      profile: data,
    });
  }

  async banOrUnbanAccount(id: string, banned: boolean) {
    await this.accountsModel.update(
      {
        id,
        deleted: false,
      },
      {
        banned,
      },
    );
  }
}
