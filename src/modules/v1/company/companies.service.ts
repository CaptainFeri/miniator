import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import CompaniesRepository from './companies.repository';
import CompanyEntity from './schemas/company.entity';
import UpdateCompanyDto from './dto/update-company.dto';
import CreateCompanyDto from '@v1/company/dto/create-company.dto';

@Injectable()
export default class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  public async create(
    company: CreateCompanyDto,
  ): Promise<CompanyEntity> {
    return this.companiesRepository.create({
      ...company,
    });
  }

  public async getById(
    id: number,
  ): Promise<CompanyEntity | undefined> {
    return this.companiesRepository.getById(id);
  }

  update(id: number, data: UpdateCompanyDto): Promise<UpdateResult> {
    return this.companiesRepository.updateById(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyEntity>> {
    return this.companiesRepository.getAllWithPagination(options);
  }
}
