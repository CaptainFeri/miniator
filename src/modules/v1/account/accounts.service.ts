import * as bcrypt from 'bcryptjs';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import SignUpDto from '@v1/auth/dto/sign-up.dto';
import AccountsRepository from './accounts.repository';
import { UpdateResult } from 'typeorm/index';
import AccountEntity from './schemas/account.entity';
import UpdateAccountDto from './dto/update-account.dto';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedAccountsInterface } from '@interfaces/paginatedEntity.interface';

@Injectable()
export default class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  public async create(account: SignUpDto): Promise<AccountEntity> {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    return this.accountsRepository.create({
      ...account,
      password: hashedPassword,
    });
  }

  public async getByEmail(email: string): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getByEmail(email);
  }

  public async getVerifiedAccountByEmail(
    email: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getVerifiedAccountByEmail(email);
  }

  public async getVerifiedAccountByUsername(
    username: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getVerifiedAccountByUsername(username);
  }

  public getUnverifiedAccountByEmail(
    email: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getUnverifiedAccountByEmail(email);
  }

  public async getById(id: number): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getById(id);
  }

  public async getVerifiedAccountById(
    id: number,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getVerifiedAccountById(id);
  }

  public async getUnverifiedAccountById(
    id: number,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getUnverifiedAccountById(id);
  }

  update(id: number, data: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountsRepository.updateById(id, data);
  }

  public async getAllVerifiedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedAccountsInterface> {
    return this.accountsRepository.getAllVerifiedWithPagination(options);
  }

  public async deleteAccount(
    id: number,
    password: string,
  ): Promise<AccountEntity | undefined> {
    const account = await this.accountsRepository.getById(id);
    if (!account) throw new NotFoundException('The item does not exist');

    const passwordCompared = await bcrypt.compare(password, account.password);

    if (!passwordCompared) throw new BadRequestException('Incorrect password');

    return this.accountsRepository.deleteAccount(account);
  }
}
