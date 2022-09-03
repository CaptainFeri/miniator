import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  BadRequestException,
  Query,
  Post,
  Body,
  NotFoundException,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import CompaniesService from './companies.service';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateCompanyDto from './dto/create-company.dto';
import UpdateCompanyDto from './dto/update-company.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @Types(TypesEnum.superAdmin)
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<any> {
    const company = await this.companiesService.create(createCompanyDto);

    return ResponseUtils.success('companies', {
      message: 'Success',
      company,
    });
  }

  @Get()
  async getAll(@Query() query: any) {
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

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponseInterface> {
    const foundCompany = await this.companiesService.getById(id);

    if (!foundCompany) {
      throw new NotFoundException('The company does not exist');
    }

    return ResponseUtils.success('companies', foundCompany);
  }

  @Put(':id')
  @Types(TypesEnum.superAdmin)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() company: UpdateCompanyDto): Promise<any> {
    await this.companiesService.update(id, company);

    return ResponseUtils.success('companies', {
      message: 'Success!',
    });
  }
}
