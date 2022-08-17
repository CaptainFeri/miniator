import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import { UpdateResult } from 'typeorm';
import AccountsRepository from './accounts.repository';
import AccountEntity from './schemas/account.entity';
import { UpdateAccountDto } from './dto';
import SignUpDto from '../auth/dto/sign-up.dto';


@Injectable()
export default class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) { }

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

  public async getById(id: string): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getById(id);
  }

  public async getVerifiedAccountById(id: string,): Promise<AccountEntity> {
    return this.accountsRepository.getVerifiedAccountById(id);
  }

  public async getUnverifiedAccountById(
    id: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getUnverifiedAccountById(id);
  }

  update(id: string, data: UpdateAccountDto): Promise<UpdateResult> {
    return this.accountsRepository.updateById(id, data);
  }

  public async getAllVerifiedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<AccountEntity>> {
    return this.accountsRepository.getAllVerifiedWithPagination(options);
  }

  public async deleteAccount(id: string, password: string): Promise<AccountEntity> {
    const account = await this.accountsRepository.getById(id);
    if (!account) throw new NotFoundException('The item does not exist');

    const passwordCompared = await bcrypt.compare(password, account.password);

    if (!passwordCompared) throw new BadRequestException('Incorrect password');

    return this.accountsRepository.deleteAccount(account);
  }
}
