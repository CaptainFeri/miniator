import {
  BadRequestException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import PaginationUtils from '@utils/pagination.utils';
import { CompaniesService } from './companies.service';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Types(TypesEnum.superAdmin)
  @MessagePattern('CompanyService_Create')
  async create(@Payload() msg: any): Promise<any> {
    const body: CreateCompanyDto = msg.value;
    return await this.companiesService.create(body);
  }

  @MessagePattern('CompanyService_GetAll')
  async getAll(@Payload() msg: any): Promise<any> {
    const query: any = msg.value;
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

  @MessagePattern('CompanyService_GetById')
  async getById(@Payload() msg: any): Promise<any> {
    const body: any = msg.value;
    const foundCompany = await this.companiesService.getById(body.id);

    if (!foundCompany) {
      throw new NotFoundException('The company does not exist');
    }

    return foundCompany;
  }

  @Types(TypesEnum.superAdmin)
  @MessagePattern('CompanyService_Update')
  async update(@Payload() msg: any): Promise<any> {
    const body: UpdateCompanyDto = msg.value;
    await this.companiesService.update(body.id, body);

    return {
      success: true,
    };
  }
}
