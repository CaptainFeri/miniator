import {
  Controller,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import CompaniesService from './companies.service';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateCompanyDto from './dto/create-company.dto';
import { GrpcMethod } from '@nestjs/microservices';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('CompanyService', 'Create')
  async create(body: CreateCompanyDto): Promise<any> {
    const company = await this.companiesService.create(body);

    return ResponseUtils.success('companies', {
      message: 'Success',
      company,
    });
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

    return ResponseUtils.success(
      'companies',
      paginatedCompanies.paginatedResult,
      {
        location: 'companies',
        paginationParams,
        totalCount: paginatedCompanies.totalCount,
      },
    );
  }

  @GrpcMethod('CompanyService', 'GetItem')
  async getById(body: any): Promise<any> {
    const foundCompany = await this.companiesService.getById(body.id);

    if (!foundCompany) {
      throw new NotFoundException('The company does not exist');
    }

    return ResponseUtils.success('companies', foundCompany);
  }

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('CompaniesService', 'Update')
  async update(body: any): Promise<any> {
    await this.companiesService.update(body.id, body);

    return ResponseUtils.success('companies', {
      message: 'Success!',
    });
  }
}
