import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import SignUpDto from '@v1/auth/dto/sign-up.dto';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import UpdateAccountDto from './dto/update-account.dto';
import AccountEntity from './schemas/account.entity';

@Injectable()
export default class AccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsModel: Repository<AccountEntity>,
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
        },
      ],
    });
  }

  public async getUnverifiedAccountByEmail(
    email: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [
        {
          email,
          verified: false,
        },
      ],
    });
  }

  public async getById(id: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id);
  }

  public async getVerifiedAccountById(
    id: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id, {
      where: [{ verified: true }],
    });
  }

  public async getUnverifiedAccountById(
    id: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id, {
      where: [{ verified: false }],
    });
  }

  public updateById(id: string, data: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountsModel.update(id, data);
  }

  public async getAllVerifiedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<AccountEntity>> {
    const verified = true;
    const [users, totalCount] = await Promise.all([
      this.accountsModel.find({
        where: {
          verified,
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

  public async deleteAccount(
    account: AccountEntity,
  ): Promise<AccountEntity | undefined> {
    return this.accountsModel.remove(account);
  }
}
