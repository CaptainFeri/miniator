import {
  BadRequestException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import PaginationUtils from '@utils/pagination.utils';
import CompaniesService from './companies.service';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateCompanyDto from './dto/create-company.dto';
import { GrpcMethod } from '@nestjs/microservices';
import UpdateCompanyDto from './dto/update-company.dto';

@Controller()
export default class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('CompanyService', 'Create')
  async create(body: CreateCompanyDto): Promise<any> {
    return await this.companiesService.create(body);
  }

  @GrpcMethod('CompanyService', 'GetAll')
  async getAll(query: any): Promise<any> {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedCompanies = await this.companiesService.getAllWithPagination(
      paginationParams,
    );

    return {
      companies: paginatedCompanies.paginatedResult,
      totalCount: paginatedCompanies.totalCount,
    };
  }

  @GrpcMethod('CompanyService', 'GetById')
  async getById(body: any): Promise<any> {
    const foundCompany = await this.companiesService.getById(body.id);

    if (!foundCompany) {
      throw new NotFoundException('The company does not exist');
    }

    return foundCompany;
  }

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('CompanyService', 'Update')
  async update(body: UpdateCompanyDto): Promise<any> {
    await this.companiesService.update(body.id, body);

    return {
      success: true,
    };
  }
}
