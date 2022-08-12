import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import UpdateCompanyDto from '@v1/company/dto/update-company.dto';
import CreateCompanyDto from '@v1/company/dto/create-company.dto';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import ResponseUtils from '../../../utils/response.utils';
import PaginationUtils from '../../../utils/pagination.utils';
import CompaniesService from './companies.service';
import { Types, TypesEnum } from '@decorators/types.decorator';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

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
  @UseGuards(JwtAccessGuard)
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
  @UseGuards(JwtAccessGuard)
  async getById(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<SuccessResponseInterface> {
    const foundCompany = await this.companiesService.getById(id);

    if (!foundCompany) {
      throw new NotFoundException('The company does not exist');
    }

    return ResponseUtils.success('companies', foundCompany);
  }

  @Post(':id')
  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() company: UpdateCompanyDto,
  ): Promise<any> {
    await this.companiesService.update(id, company);

    return ResponseUtils.success('companies', {
      message: 'Success!',
    });
  }
}
