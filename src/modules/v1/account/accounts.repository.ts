import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm/index';
import SignUpDto from '@v1/auth/dto/sign-up.dto';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedAccountsInterface } from '@interfaces/paginatedEntity.interface';
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
      where: [{
        email
      }],
    });
  }

  public async getVerifiedAccountByEmail(email: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [{
        email,
        verified: true,
      }],
    });
  }

  public async getVerifiedAccountByUsername(username: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [{
        username,
        verified: true,
      }],
    });
  }

  public async getUnverifiedAccountByEmail(email: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [{
        email,
        verified: false,
      }],
    });
  }

  public async getById(id: number): Promise<AccountEntity | undefined> {
    return  this.accountsModel.findOne(id);
  }

  public async getVerifiedAccountById(id: number): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id, {
      where: [{ verified: true }],
    });
  }

  public async getUnverifiedAccountById(id: number): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id, {
      where: [{ verified: false }],
    });
  }

  public updateById(id: number, data: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountsModel.update(id, data);
  }

  public async getAllVerifiedWithPagination(options: PaginationParamsInterface): Promise<PaginatedAccountsInterface> {
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

    return { paginatedResult: users, totalCount };
  }

  public async deleteAccount(account: AccountEntity): Promise<AccountEntity | undefined> {
    return this.accountsModel.remove(account);
  }
}
