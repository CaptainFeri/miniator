import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import AccountEntity from './schemas/account.entity';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import { UpdateAccountDto } from './dto';
import SignUpDto from '../auth/dto/sign-up.dto';
import { LoginModel } from './models/login.model';
import { TypesEnum } from '@decorators/types.decorator';

@Injectable()
export default class AccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsModel: Repository<AccountEntity>,
  ) { }

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

  public async getVerifiedAccountByEmail(email: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [
        {
          email,
          verified: true,
        },
      ],
    });
  }

  public async getVerifiedAccountByUsername(username: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne({
      where: [
        {
          username,
          verified: true,
        },
      ],
    });
  }

  public async getUnverifiedAccountByEmail(email: string): Promise<AccountEntity | undefined> {
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

  public async getVerifiedAccountById(id: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id, {
      where: [{ verified: true }],
    });
  }

  public async getUnverifiedAccountById(id: string): Promise<AccountEntity | undefined> {
    return this.accountsModel.findOne(id, {
      where: [{ verified: false }],
    });
  }

  public updateById(id: string, data: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountsModel.update(id, data);
  }

  public async getAllVerifiedWithPagination(options: PaginationParamsInterface): Promise<PaginatedEntityInterface<AccountEntity>> {
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

  public async deleteAccount(account: AccountEntity): Promise<AccountEntity | undefined> {
    return this.accountsModel.remove(account);
  }

  async login(email: string, password: string): Promise<LoginModel> {
    const user = await this.accountsModel.findOne({
      where: [
        {
          email,
        },
      ],
    });
    if (user) {
      if (user.password === password) {
        return { status: true, username: user.username, id: user.id, type: TypesEnum.user };
      }
      return { status: false, message: 'Wrong password' };
    }
    return { status: false, message: 'User not found' }
  }
}
