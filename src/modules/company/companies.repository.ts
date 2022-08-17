import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import UpdateCompanyDto from './dto/update-company.dto';
import CompanyEntity from './schemas/company.entity';
import CreateCompanyDto from './dto/create-company.dto';

@Injectable()
export default class CompaniesRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companiesModel: Repository<CompanyEntity>,
  ) {}

  public create(company: CreateCompanyDto): Promise<CompanyEntity> {
    return this.companiesModel.save({
      ...company,
    });
  }

  public async getById(id: string): Promise<CompanyEntity | undefined> {
    return this.companiesModel.findOne(id);
  }

  public updateById(id: string, data: UpdateCompanyDto): Promise<UpdateResult> {
    return this.companiesModel.update(id, data);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<CompanyEntity>> {
    const [questions, totalCount] = await Promise.all([
      this.companiesModel.find({
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.companiesModel.count(),
    ]);

    return {
      paginatedResult: questions,
      totalCount,
    };
  }
}
