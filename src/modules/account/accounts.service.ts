import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import AccountsRepository from './accounts.repository';
import AccountEntity from '@entities/account.entity';
import { UpdateAccountDto } from './dto';
import SignUpDto from '@/auth/dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-compony-profile.dto';
import RolesRepository from '@/roles/roles.repository';

@Injectable()
export default class AccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  public async create(signUp: SignUpDto): Promise<AccountEntity> {
    const hashedPassword = await bcrypt.hash(signUp.password, 10);

    return await this.accountsRepository.create({
      ...signUp,
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

  public async getVerifiedAccountById(id: string): Promise<AccountEntity> {
    return this.accountsRepository.getVerifiedAccountById(id);
  }

  public async getUnverifiedAccountById(
    id: string,
  ): Promise<AccountEntity | undefined> {
    return this.accountsRepository.getUnverifiedAccountById(id);
  }

  async verify(id: string) {
    const account = await this.accountsRepository.getById(id);
    await this.accountsRepository.updateById(id, { verified: true });
    await this.rolesRepository.addCommonRolesToUser(account);
  }

  update(id: string, data: UpdateAccountDto) {
    return this.accountsRepository.updateById(id, data);
  }

  public async getAllVerifiedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<AccountEntity>> {
    return this.accountsRepository.getAllVerifiedWithPagination(options);
  }

  public async deleteAccount(
    id: string,
    password: string,
  ): Promise<AccountEntity> {
    const account = await this.accountsRepository.getById(id);
    if (!account) throw new NotFoundException('The item does not exist');

    const passwordCompared = await bcrypt.compare(password, account.password);

    if (!passwordCompared) throw new BadRequestException('Incorrect password');

    return this.accountsRepository.deleteAccount(account);
  }

  async login(username: string, password: string) {
    password = await bcrypt.hash(password, 10);
    return await this.accountsRepository.login(username, password);
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    await this.accountsRepository.updateProfile(id, data);
  }

  async getProfile(id: string) {
    return await this.accountsRepository.getProfile(id);
  }

  async updateCompanyProfile(id: string, data: UpdateCompanyProfileDto) {
    await this.accountsRepository.updateCompanyProfile(id, data);
  }

  async banOrUnbanAccount(id: string, banned: boolean) {
    await this.accountsRepository.banOrUnbanAccount(id, banned);
  }
}
