import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { CompaniesRepository } from './companies.repository';
import { CompanyEntity } from '@entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ClientGrpc } from '@nestjs/microservices';
import {
  COMPANY_SERVICE_NAME,
  CompanyServiceClient,
} from '@interfaces/wallet.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompaniesService implements OnModuleInit {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    @Inject('WALLET_SERVICE') private client: ClientGrpc,
  ) {}

  private companyService: CompanyServiceClient;

  onModuleInit() {
    this.companyService =
      this.client.getService<CompanyServiceClient>(COMPANY_SERVICE_NAME);
  }

  public async create(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const company = await this.companiesRepository.create({
      ...dto,
    });

    await firstValueFrom(
      this.companyService.create({
        ...dto,
        companyId: company.id,
      }),
    );
    return company;
  }

  public async getById(id: string): Promise<CompanyEntity | undefined> {
    return this.companiesRepository.getById(id);
  }

  async update(id: string, data: UpdateCompanyDto) {
    await this.companiesRepository.updateById(id, data);
    await firstValueFrom(
      this.companyService.update({
        id,
        ...data,
      }),
    );
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyEntity>> {
    return this.companiesRepository.getAllWithPagination(options);
  }
}
